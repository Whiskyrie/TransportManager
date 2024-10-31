import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    private getFileUrl(filename: string): string {
        const baseUrl = this.configService.get<string>('APP_URL', 'http://192.168.0.14:3000');
        return `${baseUrl}/uploads/${filename}`;
    }

    async saveProfilePicture(userId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        // Verificar tipo do arquivo
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Apenas imagens são permitidas');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        // Criar diretório de uploads se não existir
        const uploadDir = join(process.cwd(), 'uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Erro ao criar diretório:', error);
        }

        // Gerar nome único para o arquivo
        const fileName = `${uuid()}.jpg`;
        const filePath = join(uploadDir, fileName);

        try {
            // Processar e salvar a imagem
            await sharp(file.buffer)
                .resize(300, 300, {
                    fit: 'cover',
                    position: 'center',
                })
                .jpeg({ quality: 90 })
                .toFile(filePath);

            // Deletar foto antiga se existir
            if (user.profilePicture) {
                const oldFilePath = join(uploadDir, user.profilePicture.split('/').pop());
                try {
                    await fs.unlink(oldFilePath);
                } catch (error) {
                    console.error('Erro ao deletar arquivo antigo:', error);
                }
            }

            // Salvar a URL completa no banco de dados
            const fileUrl = this.getFileUrl(fileName);
            user.profilePicture = fileUrl;
            await this.userRepository.save(user);

            return {
                message: 'Foto de perfil atualizada com sucesso',
                user: {
                    ...user,
                    profilePicture: fileUrl
                }
            };
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            throw new BadRequestException('Erro ao processar imagem');
        }
    }

    async deleteProfilePicture(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        if (!user.profilePicture) {
            throw new BadRequestException('Usuário não possui foto de perfil');
        }

        // Modificar para pegar apenas o nome do arquivo
        const fileName = user.profilePicture.split('/').pop();
        const filePath = join(process.cwd(), 'uploads', fileName);

        try {
            await fs.unlink(filePath);
            user.profilePicture = null;
            await this.userRepository.save(user);

            return {
                message: 'Foto de perfil removida com sucesso'
            };
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error);
            throw new BadRequestException('Erro ao remover foto de perfil');
        }
    }
}