import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type DriverStatus = 'Disponível' | 'Indisponível';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    licenseNumber: string;

    @Column({
            type: 'enum',
            enum: ['Disponível', 'Indisponível', 'Em manutenção'],
            default: 'Disponível'
        })
        status: DriverStatus;
}
