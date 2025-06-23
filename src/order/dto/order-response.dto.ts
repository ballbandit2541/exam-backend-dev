export class OrderItemResponseDto {
  orderItemId: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export class OrderResponseDto {
  orderId: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemResponseDto[];
}
