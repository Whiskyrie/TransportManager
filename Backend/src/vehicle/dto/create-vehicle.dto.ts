// create-vehicle.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    plateNumber: string;
}
