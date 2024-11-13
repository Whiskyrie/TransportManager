// create-driver.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    licenseNumber: string;
}
