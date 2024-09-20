import { CartItemResponse } from '../response/CartItemResponse';

export class CreatePaymentRequest {
  code!: string;
  paymentMethod!: string;
  paymentMethodId!: number; // Thêm thuộc tính này để khớp với backend
  addressCode!: number;
  addressMethod!: string;
  fee!: number;
  totalPricePro!: number;
  total!: number;
  username!: string;
  cartItems!: CartItemResponse[];
}
