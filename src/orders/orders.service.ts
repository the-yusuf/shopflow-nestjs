import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderStatus } from './order-status.js';
import { CreateOrderDto, ShippingAddressDto } from './dto/create-order.dto.js';
import { ProductsService } from '../products/products.service.js';

export interface OrderLine {
  productId: string;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerEmail: string;
  status: OrderStatus;
  lines: OrderLine[];
  totalCents: number;
  shippingAddress: ShippingAddressDto;
  createdAt: Date;
}

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, Order>();

  constructor(private readonly productsService: ProductsService) {}

  quote(items: { productId: string; quantity: number }[]) {
    const lines = items.map(({ productId, quantity }) => {
      const product = this.productsService.findOne(productId);
      return {
        productId,
        quantity,
        lineTotalCents: product.priceCents * quantity,
      };
    });
    const totalCents = lines.reduce(
      (sum, line) => sum + line.lineTotalCents,
      0,
    );
    return { lines, totalCents };
  }

  create(dto: CreateOrderDto): Order {
    const { lines, totalCents } = this.quote(dto.items);
    const order: Order = {
      id: randomUUID(),
      number: `ORD-${1000 + this.orders.size}`,
      customerId: 'guest',
      customerEmail: 'guest@shopflow.example',
      status: OrderStatus.Pending,
      lines,
      totalCents,
      shippingAddress: dto.shippingAddress,
      createdAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  findAll(): Order[] {
    return [...this.orders.values()];
  }

  findOne(id: string): Order {
    const order = this.orders.get(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
