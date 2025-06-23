import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({name: 'order_item_id'})
  orderItemId: number;

  @Column({name: 'order_id'})
  orderId: number;

  @Column({name: 'product_id'})
  productId: number;

  @Column({name: 'quantity'})
  quantity: number;

  @Column({name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({name: 'subtotal', type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
