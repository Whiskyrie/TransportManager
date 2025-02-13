import { Controller, Post, Body, UseGuards, Get, Request, BadRequestException  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponse, RequestPasswordResetDto, ResetPasswordDto, VerifyResetCodeDto } from './dto/auth.dto';
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
    async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<{ code: string }> {
    const { email } = requestPasswordResetDto;
    const code = await this.authService.requestPasswordReset(email); // Ajuste a função no `authService` para enviar o código ao invés de um link
    return { code }; // Retorne o código na resposta
  }

    // Rota para verificar o código de redefinição de senha
    @Post('verify-reset-code')
    async verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto): Promise<boolean> {
    const { email, code } = verifyResetCodeDto;
    const isCodeValid = await this.authService.verifyCode(email, code);
    
    if (!isCodeValid) {
        throw new BadRequestException('Código de redefinição inválido ou expirado.');
    }
    return true; // Retorna true se o código for válido
}

    // Nova rota para redefinir a senha
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, newPassword } = resetPasswordDto;

    await this.authService.resetPassword(email, newPassword);

    return { message: 'Senha redefinida com sucesso' };
  }
}

