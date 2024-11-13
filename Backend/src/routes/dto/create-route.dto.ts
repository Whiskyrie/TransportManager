// create-route.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRouteDto {
    @IsNotEmpty()
    startLocation: string;

    @IsNotEmpty()
    endLocation: string;

    @IsNotEmpty()
    distance: number;

    @IsNotEmpty()
    estimatedDuration: number;

    @IsUUID()
    vehicleId: string;

    @IsUUID()
    driverId: string;
}
