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
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
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
                    new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Request() req: Express.Request,
    ) {
        return this.uploadService.saveProfilePicture(req.user["id"], file);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile-picture')
    async deleteProfilePicture(@Request() req: Express.Request) {
        return this.uploadService.deleteProfilePicture(req.user["id"]);
    }

    @Get('profile-picture/:filename')
    async getProfilePicture(@Param('filename') filename: string, @Res() res: Response) {
        const file = join(process.cwd(), 'uploads', filename);
        return res.sendFile(file);
    }
}