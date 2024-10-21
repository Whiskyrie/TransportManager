export type VehicleStatus = 'Disponível' | 'Indisponível' | 'Em manutenção';


export interface Vehicle {
    id: string;
    plate: string;
    year: number;
    model: string;
    brand: string;
    status: VehicleStatus;
}