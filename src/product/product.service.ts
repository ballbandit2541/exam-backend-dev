import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    
    await this.cacheManager.del('all_products');
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    const cachedProducts = await this.cacheManager.get<Product[]>('all_products');
    if (cachedProducts) {
      // console.log('from cache');
      return cachedProducts;
    }
    
    const products = await this.productRepository.find({ where: { isActive: true } });
    await this.cacheManager.set('all_products', products);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }
    
    const product = await this.productRepository.findOne({ where: { productId: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, product);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    const cacheKey = `product_${id}`;
    await this.cacheManager.del(cacheKey);
    await this.cacheManager.del('all_products');
    return updatedProduct;
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    await this.cacheManager.del('all_products');
    
    return { message: `Product ID ${id} removed success` };
  }
}
