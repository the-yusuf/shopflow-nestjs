import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { randomUUID } from 'crypto';
import { UpdateProductDto, UpdateStockDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  stock: number;
  categoryId: string;
  imageUrls?: string[];
  createdAt: Date;
}

const SORTS = {
  newest: (a: Product, b: Product) =>
    b.createdAt.getTime() - a.createdAt.getTime(),
  price_asc: (a: Product, b: Product) => a.priceCents - b.priceCents,
  price_desc: (a: Product, b: Product) => b.priceCents - a.priceCents,
};

@Injectable()
export class ProductsService {
  private readonly products = new Map<string, Product>();

  findAll(query: ProductQueryDto) {
    let items = [...this.products.values()];

    // Search
    if (query.search) {
      const term = query.search;
      items = items.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    // Category
    if (query.categoryId)
      items = items.filter((p) => p.categoryId === query.categoryId);

    // Stock
    if (query.inStock) items = items.filter((p) => p.stock > 0);

    // Sort
    items.sort(SORTS[query.sort]);

    // Pagination
    const offset = (query.page - 1) * query.limit;
    items = items.slice(offset, offset + query.limit);

    return { items, total: items.length, page: query.page, limit: query.limit };
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

  updateStock(id: string, dto: UpdateStockDto) {
    const updated = { ...this.findOne(id), ...dto };
    this.products.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.products.delete(id);
  }
}
