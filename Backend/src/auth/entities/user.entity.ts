import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    profilePicture: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    lastLogin: Date;
}

