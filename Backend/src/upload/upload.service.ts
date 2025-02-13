import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async saveProfilePicture(userId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Apenas imagens são permitidas');
        }

        try {
            // Detailed logging for debugging
            console.log('Processing image:', {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                encoding: file.encoding,
                bufferLength: file.buffer?.length
            });

            // Validate buffer
            if (!file.buffer || file.buffer.length === 0) {
                throw new BadRequestException('Buffer da imagem inválido ou vazio');
            }

            // Verify image format before processing
            const metadata = await sharp(file.buffer).metadata();
            console.log('Image metadata:', metadata);

            // More robust image processing
            const processedImageBuffer = await sharp(file.buffer, {
                failOnError: false,
                limitInputPixels: 50000000, // Increased limit for larger images
                density: 300
            })
                .rotate() // Auto-rotate based on EXIF
                .resize(300, 300, {
                    fit: 'cover',
                    position: 'center',
                    withoutEnlargement: true,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .jpeg({
                    quality: 85,
                    chromaSubsampling: '4:4:4',
                    force: true // Always output JPEG
                })
                .toBuffer();

            // Validate processed buffer
            if (!processedImageBuffer || processedImageBuffer.length === 0) {
                throw new BadRequestException('Falha ao processar a imagem');
            }

            const base64Image = processedImageBuffer.toString('base64');
            
            // Find and update user
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new BadRequestException('Usuário não encontrado');
            }

            // Save the processed image
            user.profilePicture = base64Image;
            const savedUser = await this.userRepository.save(user);

            return {
                message: 'Foto de perfil atualizada com sucesso',
                user: {
                    ...savedUser,
                    profilePicture: base64Image
                }
            };
        } catch (error) {
            console.error('Erro detalhado no processamento da imagem:', {
                error: error.message,
                stack: error.stack,
                code: error.code
            });

            // More specific error messages
            if (error.message.includes('Input buffer contains unsupported image format')) {
                throw new BadRequestException('Formato de imagem não suportado. Use apenas JPG ou PNG.');
            } else if (error.message.includes('Input buffer is empty')) {
                throw new BadRequestException('Arquivo de imagem vazio ou corrompido.');
            } else {
                throw new BadRequestException(`Erro ao processar imagem: ${error.message}`);
            }
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

        user.profilePicture = null;
        await this.userRepository.save(user);

        return {
            message: 'Foto de perfil removida com sucesso'
        };
    }
}