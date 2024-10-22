// File: types.ts

import { Drivers } from "Components/Driver/Types";
import { Vehicles } from "Components/Vehicle/Types";
import Driver from "Models/Driver";
import Vehicle from "Models/Vehicle";

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
