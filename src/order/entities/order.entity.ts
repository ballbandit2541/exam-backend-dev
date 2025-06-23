import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({name: 'order_id'})
  orderId: number;

  @Column({name: 'user_id'})
  userId: number;

  @Column({name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({name: 'status', default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany('OrderItem', 'order', {
    cascade: true,
    eager: true,
  })
  items: any[];
}
