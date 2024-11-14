import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import { sendPasswordResetEmail } from '../common/emailService'; // Importando a função de envio de e-mail

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    // Função para registrar um novo usuário
    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email já registrado');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        const token = this.generateToken(user);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isActive: user.isActive,
            },
        };
    }

    // Função de login
    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Atualiza o último login
        user.lastLogin = new Date();
        await this.userRepository.save(user);

        const token = this.generateToken(user);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isActive: user.isActive,
            },
        };
    }

    // Função de logout
    async logout(userId: string): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (user) {
                user.lastLogin = new Date();
                await this.userRepository.save(user);
            }

            return { success: true };
        } catch {
            return { success: true };
        }
    }

    // Função para solicitar a recuperação de senha
    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Gera o token para redefinição de senha
        const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });

        // Envia o e-mail de recuperação com o token
        await sendPasswordResetEmail(user.email, token);
    }

    // Função para redefinir a senha
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const decoded = this.jwtService.verify(token); // Verifica o token

            const user = await this.userRepository.findOne({ where: { id: decoded.id } });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            // Criptografa a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Atualiza a senha do usuário no banco de dados
            user.password = hashedPassword;
            await this.userRepository.save(user);
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
    
        if (!user) {
          throw new UnauthorizedException('Usuário não encontrado');
        }
    
        return user;
      }
    // Função para gerar o token JWT
    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        };

        return this.jwtService.sign(payload);
    }
}
