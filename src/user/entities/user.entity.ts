import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    userId: number;

    @Column({ name: 'user_email', default: null })
    userEmail: string;

    @Column({ name: 'user_role', default: 'user' })
    userRole: string;

    @Exclude()
    @Column({ name: 'user_password', unique: true })
    userPassword: string;

    @Column({ name: 'user_first_name', nullable: true, default: null })
    userFirstName: string;

    @Column({ name: 'user_last_name', nullable: true, default: null })
    userLastName: string;

    @Exclude()
    @Column({ nullable: true })
    refreshToken: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}

