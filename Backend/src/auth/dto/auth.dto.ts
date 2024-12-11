    import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    phoneNumber?: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class RequestPasswordResetDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string; // Adiciona o e-mail para identificação do usuário
    @IsNotEmpty()
    @IsString()
    code: string; // Código de redefinição de senha recebido por e-mail

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}

export class VerifyResetCodeDto {
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    code: string;
}
export class AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        phoneNumber?: string;
        profilePicture?: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        lastLogin?: Date;
    };
}