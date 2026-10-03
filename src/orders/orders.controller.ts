import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('quote')
  create(@Body() body: { productId: string; quantity: number }[]) {
    return this.ordersService.quote(body);
  }
}
