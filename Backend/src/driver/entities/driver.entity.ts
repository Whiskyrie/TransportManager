import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    licenseNumber: string;
}
