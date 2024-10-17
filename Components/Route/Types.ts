// File: types.ts

export type RouteStatus = 'Em Progresso' | 'Pendente' | 'Concluído' | 'Cancelado';
export interface RouteLocation {
    name: string;
    address: string;
}

export interface Route {
    code: string;
    status: RouteStatus;
    distance: number;
    startLocation: string | RouteLocation;
    endLocation: string | RouteLocation;
    estimatedDuration: number;
}
