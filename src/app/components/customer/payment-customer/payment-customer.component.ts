import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/commons/dto/Product';
import { CreatePaymentRequest } from 'src/app/commons/request/CreatepaymentRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { CartItemResponse } from 'src/app/commons/response/CartItemResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { PaymentResponse } from 'src/app/commons/response/PaymentResponse';
import { ShippingFeeResponse } from 'src/app/commons/response/ShippingFeeResponse';
import { ShowProductResponse } from 'src/app/commons/response/ShowProductResponse';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { GhnService } from 'src/app/service/ghn/ghn.service';
import { PaymentService } from 'src/app/service/payment/payment.service';

@Component({
  selector: 'app-payment-customer',
  templateUrl: './payment-customer.component.html',
  styleUrl: './payment-customer.component.css',
})
export class PaymentCustomerComponent implements OnInit {
  response: PaymentResponse;
  responses: ShowProductResponse = new ShowProductResponse();
  product: Product = new Product();
  userInfo: UserInfoResponse;
  paymentCode: string = '';
  baseResponse: BaseResponse<any>;
  request: CreatePaymentRequest;
  loading: boolean = false;
  shippingFee: number = 0;
  error: ErrorResponse;
  totalAmount: number = 0;
  productList: any[] = [];
  selectedAddressMethod = '';
  cartItems: CartItemResponse[] = []; // Hoặc kiểu dữ liệu cụ thể của sản phẩm nếu có

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private ghnService: GhnService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.error = new ErrorResponse();
    this.response = new PaymentResponse();
    this.baseResponse = new BaseResponse();
    this.userInfo = new UserInfoResponse();
    this.request = new CreatePaymentRequest();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.paymentCode = params['code'];
      this.userInfor();

      this.route.queryParams.subscribe((params) => {
        console.log(params); // Kiểm tra queryParams
        this.totalAmount = +params['totalAmount'] || 0;
        this.request.totalPricePro = this.totalAmount;
        const cartItemData = params['listCartItem'];
        if (cartItemData) {
          try {
            const products = JSON.parse(cartItemData); // Chuyển dữ liệu JSON thành danh sách sản phẩm
            console.log('Sản phẩm đã nhận:', products);
            this.cartItems = products; // Lưu danh sách sản phẩm vào biến selectedProducts
            this.request.cartItems = this.cartItems;
          } catch (error) {
            console.error('Lỗi khi parse dữ liệu sản phẩm:', error);
          }
        } else {
          this.cartItems = [];
        }
      });
    });
    // const storedShippingFee = localStorage.getItem('shippingFee');
    // if (storedShippingFee) {
    //   this.shippingFee = parseFloat(storedShippingFee);
    //   this.request.fee = this.shippingFee;
    // } else {
    //   console.log('No Shipping Fee found in localStorage');
    // }
  }

  getInfo(code: string) {
    this.loading = true;
    this.paymentService.getInfoPayment(code).subscribe(
      (res) => {
        this.baseResponse = res as BaseResponse<any>;
        this.response = this.baseResponse.data;
        this.loading = false;
      },
      (error) => {
        // quay lại trang trước
        window.history.back();
      }
    );
  }
  calculateShippingFee(): void {
    const data = {
      service_id: 53321,
      insurance_value: 500000,
      coupon: null,
      from_district_id: 3440, // Sử dụng thông tin từ userInfo
      to_district_id: this.userInfo.districtID,
      to_ward_code: this.userInfo.wardCode,
      height: 15,
      length: 15,
      weight: 1000,
      width: 15,
    };

    this.ghnService.calculateShippingFee(data).subscribe({
      next: (response: ShippingFeeResponse) => {
        console.log('API Response:', response); // Xem toàn bộ phản hồi từ API
        if (
          response.code === 200 &&
          response.data &&
          response.data.total !== undefined
        ) {
          this.shippingFee = response.data.total;
          this.request.fee = this.shippingFee; // Cập nhật phí vận chuyển trong yêu cầu
        } else {
          console.error('Invalid response data:', response);
          this.shippingFee = 0; // Đặt giá trị mặc định
        }
      },
      error: (error) => {
        console.error('Error fetching shipping fee:', error);
        this.shippingFee = 0; // Đặt giá trị mặc định
      },
    });
  }

  userInfor() {
    this.paymentService.userInfor().subscribe(
      (res) => {
        this.baseResponse = res as BaseResponse<any>;
        this.userInfo = this.baseResponse.data;
        this.calculateShippingFee();
        if (!this.userInfo.address) {
          this.shippingFee = 0;
          this.request.fee = this.shippingFee;
        }
      },
      (error) => {
        if (error.error && typeof error.error === 'object') {
          // Nếu lỗi là đối tượng, lấy thông điệp lỗi
          const errorMessage =
            error.error.message || 'Có lỗi xảy ra, vui lòng thử lại.';
          this.showError(errorMessage);
        } else if (Array.isArray(error.error)) {
          // Nếu lỗi là mảng, hiển thị từng lỗi
          error.error.forEach((message: string) => {
            this.showError(message);
          });
        } else {
          // Nếu không phải là mảng hay đối tượng, hiển thị thông báo lỗi chung
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
        // Làm sạch phí vận chuyển trong trường hợp lỗi
        this.shippingFee = 0;
        this.request.fee = this.shippingFee; // Cập nhật phí vận chuyển trong yêu cầu
      }
    );
  }

  selectMethodPayment(method: string) {
    this.request.paymentMethod = method;
  }

  selectMethodAddress(method: string) {
    this.request.addressMethod = method;
  }

  goBack() {
    window.history.back();
  }

  payment() {
    if (!this.userInfo.address) {
      alert('Vui lòng thêm địa chỉ trước khi tiếp tục.');
      return;
    }
    this.paymentService.createPayment(this.request).subscribe(
      (res) => {
        this.baseResponse = res as BaseResponse<any>;
        this.response = this.baseResponse.data;
        this.showSuccess('Thanh toán thành công');
        this.router.navigate(['/']);
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.showError(this.error.msgError);
      }
    );
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'thanh toán thành công',
      detail: message,
    });
  }

  goToAddress() {
    this.router.navigate(['/profile/address']);
  }
}
