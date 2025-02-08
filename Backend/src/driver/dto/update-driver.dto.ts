import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDriverDto {
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsString()
    licenseNumber?: string;

    @IsNotEmpty()
    @IsString()
    status?: 'Disponível' | 'Indisponível' | 'Em manutenção';
}
