import { IsString, IsNumber } from 'class-validator';

export class CreateRouteDto {
    @IsString()
    startLocation: string;

    @IsString()
    endLocation: string;

    @IsNumber()
    distance: number;

    @IsNumber()
    estimatedDuration: number;
}