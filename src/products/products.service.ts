import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { randomUUID } from 'crypto';
import { UpdateProductDto } from './dto/update-product.dto.js';

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
  categoryId: string;
  createdAt: Date;
}

@Injectable()
export class ProductsService {
  private readonly products = new Map<string, Product>();

  findAll(categoryId?: string): Product[] {
    const products = [...this.products.values()];

    if (categoryId) {
      return products.filter((p) => p.categoryId === categoryId);
    }

    return products;
  }

  findOne(id: string): Product {
    const product = this.products.get(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: randomUUID(),
      createdAt: new Date(),
      ...dto,
    };
    this.products.set(product.id, product);
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const updated = { ...this.findOne(id), ...dto };
    this.products.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.products.delete(id);
  }
}
