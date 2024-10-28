// File: types.ts

import { Drivers } from "Types/driverTypes";
import { Vehicles } from "Types/vehicleTypes";

export type RouteStatus = 'Em Progresso' | 'Pendente' | 'Concluído' | 'Cancelada';
export interface RouteLocation {
    address: string;
}

export interface Route {
    id: string;
    status: RouteStatus;
    distance: number;
    startLocation: string | RouteLocation;
    endLocation: string | RouteLocation;
    estimatedDuration: number;
    vehicle: Vehicles;
    driver: Drivers;
}
