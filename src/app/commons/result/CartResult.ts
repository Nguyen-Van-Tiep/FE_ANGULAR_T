export class CartResult {
  detailCartId: number;
  detailProductId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  size: string;
  brand: string;
  constructor() {
    this.detailCartId = 0;
    this.detailProductId = 0;
    this.productName = '';
    this.quantity = 0;
    this.price = 0;
    this.total = 0;
    this.image = '';
    this.size = '';
    this.brand = '';
  }
}
