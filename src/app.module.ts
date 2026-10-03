import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { CategoriesModule } from './categories/categories.module.js';

@Module({
  imports: [ProductsModule, OrdersModule, CategoriesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
