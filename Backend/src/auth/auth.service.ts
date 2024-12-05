import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto, AuthResponse, ResetPasswordDto } from './dto/auth.dto';
import { emailService } from '../common/emailService'; // Importando a função de envio de e-mail


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

        return {
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


        return {
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

    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });
    
        if (!user) {
          throw new NotFoundException('Usuário não encontrado');
        }
    
        // Gera um código de 6 dígitos para redefinição de senha
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
        // Salva o código e sua expiração no banco de dados (exemplo: 10 minutos)
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos a partir de agora
        await this.userRepository.save(user);
    
        // Envia o e-mail de recuperação com o código
        await emailService.sendResetPasswordEmail(user.email, resetCode);
      }
    
    // auth.service.ts
async resetPassword(resetCode: string, newPassword: string): Promise<void> {
    try {
        // Encontra o usuário que possui o código de redefinição correspondente
        const user = await this.userRepository.findOne({ where: { resetPasswordCode: resetCode } });

        if (!user) {
            throw new UnauthorizedException('Código de redefinição inválido.');
        }

        // Verifica se o código não expirou
        if (new Date() > new Date(user.resetPasswordExpires)) {
            throw new UnauthorizedException('Código de redefinição expirado.');
        }

        // Criptografa a nova senha
        const saltRounds = 10; // Configure isso em um arquivo de configuração, se necessário
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Atualiza a senha do usuário no banco de dados
        user.password = hashedPassword;
        user.resetPasswordCode = null; // Limpa o código de redefinição após a mudança de senha
        user.resetPasswordExpires = null; // Limpa a data de expiração do código
        await this.userRepository.save(user);

    } catch (error) {
        // Relança o erro para casos não esperados
        throw error;
    }
}

async verifyCodeAndResetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se o código de redefinição de senha é válido e se não expirou
    if (user.resetPasswordCode !== code || new Date() > user.resetPasswordExpires) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    // Criptografa a nova senha e atualiza no banco de dados
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await this.userRepository.save(user);
  }


    // Função para validar um usuário por ID
    async validateUser(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return user;
    }
}
