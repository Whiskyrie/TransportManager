import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateVehicleDto {
    @IsNotEmpty()
    @IsString()
    make?: string;

    @IsNotEmpty()
    @IsString()
    model?: string;

    @IsNotEmpty()
    @IsString()
    plateNumber?: string;
}
