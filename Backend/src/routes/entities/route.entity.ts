import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Route extends BaseEntity {
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
