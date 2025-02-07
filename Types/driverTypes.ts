export type DriverStatus = 'Disponível' | 'Indisponível';

export interface Drivers {
    id: string;
    name: string;
    licenseNumber: string;
    status: DriverStatus;
}