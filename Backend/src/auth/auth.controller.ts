import { Controller, Post, Body, UseGuards, Get, Request, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponse, RequestPasswordResetDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    jwtService: any;
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
    // Nova rota para solicitar redefinição de senha
    @Post('send-reset-password-code')
    async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    const { email } = requestPasswordResetDto;
    await this.authService.requestPasswordReset(email); // Ajuste a função no `authService` para enviar o código ao invés de um link
    }


    // Nova rota para redefinir a senha
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, code, newPassword } = resetPasswordDto;
    await this.authService.verifyCodeAndResetPassword(email, code, newPassword);
  }
}

