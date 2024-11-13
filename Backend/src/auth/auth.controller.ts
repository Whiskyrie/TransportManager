import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return req.user;
    }
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req: any) {
        try {
            return await this.authService.logout(req.user.id);
        } catch {
            // Mesmo que dê erro, consideramos o logout bem-sucedido
            return { success: true };
        }
    }
}