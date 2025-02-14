import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request,
    Delete,
    Get,
    Param,
    Res,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import {  memoryStorage  } from 'multer';

import { join } from 'path';


@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @UseGuards(JwtAuthGuard)
    @Post('profile-picture')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
        fileFilter: (_req, file, callback) => {
            const mimetypes = ['image/jpeg', 'image/png'];
            if (!mimetypes.includes(file.mimetype)) {
                return callback(new BadRequestException('Formato de arquivo inválido'), false);
            }
            callback(null, true);
        },
    }))
    async uploadProfilePicture(
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
    ) {
        try {
            console.log('Arquivo recebido:', {
                buffer: file?.buffer ? 'presente' : 'ausente',
                size: file?.size,
                mimetype: file?.mimetype
            });
            
            const result = await this.uploadService.saveProfilePicture(req.user.id, file);
            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile-picture')
    async deleteProfilePicture(@Request() req: any) {
        return this.uploadService.deleteProfilePicture(req.user.id);
    }

    @Get('profile-picture/:filename')
    async getProfilePicture(@Param('filename') filename: string, @Res() res: Response) {
        const file = join(process.cwd(), 'uploads', filename);
        return res.sendFile(file);
    }
}