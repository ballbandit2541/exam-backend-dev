import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({name: 'product_id'})
  productId: number;

  @Column({ length: 100, name: 'product_name' })
  productName: string;

  @Column({ type: 'text', nullable: true, name: 'product_desc' })
  productDesc: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'product_price' })
  productPrice: number;

  @Column({ default: 0, name: 'product_stock' })
  productStock: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

}
