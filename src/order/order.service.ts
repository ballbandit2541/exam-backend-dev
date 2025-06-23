import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order, 'main')
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem, 'main')
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product, 'main')
    private productRepository: Repository<Product>,
    @InjectDataSource('main')
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.userId = createOrderDto.userId;
      order.status = 'pending';
      order.totalAmount = 0;
      
      const savedOrder = await queryRunner.manager.save(order);
      
      const productIds = createOrderDto.items.map(item => item.productId);
      const products = await queryRunner.manager.find(Product, {
        where: productIds.map(id => ({ productId: id }))
      });
      
      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products not found');
      }
      
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];
      
      for (const item of createOrderDto.items) {
        const product = products.find(p => p.productId === item.productId);
        
        if (!product) {
          throw new BadRequestException(`Product with ID ${item.productId} not found`);
        }
        
        if (product.productStock < item.quantity) {
          throw new BadRequestException(`Product ${product.productName} has insufficient stock`);
        }
        
        product.productStock -= item.quantity;
        await queryRunner.manager.save(product);
        
        const orderItem = new OrderItem();
        orderItem.orderId = savedOrder.orderId;
        orderItem.productId = item.productId;
        orderItem.quantity = item.quantity;
        orderItem.price = product.productPrice;
        orderItem.subtotal = product.productPrice * item.quantity;
        
        orderItems.push(orderItem);
        totalAmount += orderItem.subtotal;
      }
      
      await queryRunner.manager.save(OrderItem, orderItems);
      
      savedOrder.totalAmount = totalAmount;
      await queryRunner.manager.save(Order, savedOrder);
      
      await queryRunner.commitTransaction();
      
      return this.findOne(savedOrder.orderId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['items']
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
      
      // ถ้าสถานะเป็น 'cancelled' จะคืนสินค้ากลับเข้าสต็อก
      if (updateOrderDto.status === 'cancelled') {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
          for (const item of order.items) {
            const product = await queryRunner.manager.findOne(Product, {
              where: { productId: item.productId }
            });
            
            if (product) {
              product.productStock += item.quantity;
              await queryRunner.manager.save(product);
            }
          }
          
          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
      }
    }
    
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    
    if (order.status !== 'pending') {
      throw new BadRequestException(`Cannot delete order with status: ${order.status}`);
    }
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const item of order.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { productId: item.productId }
        });
        
        if (product) {
          product.productStock += item.quantity;
          await queryRunner.manager.save(product);
        }
      }
      
      await queryRunner.manager.remove(order);
      
      await queryRunner.commitTransaction();
      
      return { message: `Order with ID ${id} has been successfully deleted` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
