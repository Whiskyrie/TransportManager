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

export class AuthResponse {
    token: string;
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