import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Definindo o tipo VehicleStatus
export type VehicleStatus = 'Disponível' | 'Indisponível' | 'Em manutenção';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    plate: string;

    @Column({
        type: 'enum',
        enum: ['Disponível', 'Indisponível', 'Em manutenção'],
        default: 'Disponível'
    })
    status: VehicleStatus;
}