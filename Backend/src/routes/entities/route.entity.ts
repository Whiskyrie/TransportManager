// route.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Driver } from 'src/driver/entities/driver.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

@Entity()
export class Route {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    startLocation: string;

    @Column()
    endLocation: string;

    @Column('float')
    distance: number;

    @Column('float')
    estimatedDuration: number;

    @ManyToOne(() => Driver, { eager: true })
    driver: Driver;

    @ManyToOne(() => Vehicle, { eager: true })
    vehicle: Vehicle;

    @Column({
        type: 'enum',
        enum: ['Pendente', 'Em Progresso', 'Concluído', 'Cancelada'],
        default: 'Pendente',
    })
    status: 'Pendente' | 'Em Progresso' | 'Concluído' | 'Cancelada';

    start(): void {
        if (this.status === 'Pendente') {
            this.status = 'Em Progresso';
        }
    }

    complete(): void {
        if (this.status === 'Em Progresso') {
            this.status = 'Concluído';
        }
    }

    cancel(): void {
        if (this.status !== 'Concluído') {
            this.status = 'Cancelada';
        }
    }
}
