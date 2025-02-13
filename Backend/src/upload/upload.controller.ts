import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request,
    Delete,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Get,
    Param,
    Res,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { join } from 'path';


@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @UseGuards(JwtAuthGuard)
    @Post('profile-picture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png)$/ }), // Regex mais precisa
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
        @Request() req: any,
    ) {
        try {
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