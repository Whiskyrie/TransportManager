// File: types.ts
export type RouteStatus = 'Em Progresso' | 'Pendente' | 'Concluído';

export interface RouteLocation {
    name: string;
    address: string;
}

export interface Route {
    code: any;
    status: RouteStatus;
    distance: number;
    startLocation: RouteLocation;
    endLocation: RouteLocation;
    estimatedDuration: number;
}