import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { zip } from 'rxjs';
import { AddressInfo } from 'src/app/commons/info/AddressInfo';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { AddressRequest } from 'src/app/commons/request/AddressRequest';
import { CreateAddressRequest } from 'src/app/commons/request/CreateAddressRequest';
import { AddressesResponse } from 'src/app/commons/response/AddressesResponse';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { ShippingFeeResponse } from 'src/app/commons/response/ShippingFeeResponse';
import { AddressResult } from 'src/app/commons/result/AddressResult';
import { env } from 'src/app/environment/env';
import { AddressService } from 'src/app/service/address/address.service';
import { CommonService } from 'src/app/service/common/common.service';
import { GhnService } from 'src/app/service/ghn/ghn.service';
import { TokenStorageService } from 'src/app/service/tokenStorage/token-storage.service';

const BASE_ADDRESS = env.address;
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-address-customer',
  templateUrl: './address-customer.component.html',
  styleUrl: './address-customer.component.css',
})
export class AddressCustomerComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: AddressesResponse = new AddressesResponse();
  disableDefault: boolean = false;
  isVisible: boolean = false;
  request: AddressRequest;
  createRequest: CreateAddressRequest;
  loading: boolean = false;
  error!: ErrorResponse;
  typeSelected: string = 'H';
  shippingFee: number = 0;
  addressType: any[] = [
    { name: 'Nhà riêng', value: 'H' },
    { name: 'Công ty', value: 'C' },
    { name: 'Khác', value: 'O' },
  ];
  addressses: typeof BASE_ADDRESS;
  cities: AddressInfo[];
  selectedCity: AddressInfo | null = null;
  districts: AddressInfo[];
  selectedDistrict: AddressInfo | null = null;
  wards: AddressInfo[];
  selectedProvinceID!: number;
  selectedDistrictID!: number;
  selectedWardCode!: string;
  selectedWard: AddressInfo | null = null;
  selectedAddress: AddressInfo | null = null;
  isEdit: boolean = false;
  username: string = '';
  isPayment: boolean = false;
  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private commonService: CommonService,
    private addressService: AddressService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private ghnService: GhnService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.baseResponse = new BaseResponse();
    this.addressses = BASE_ADDRESS;
    this.cities = [];
    this.selectedCity = new AddressInfo();
    this.districts = [];
    this.selectedDistrict = new AddressInfo();
    this.wards = [];
    this.selectedWard = new AddressInfo();
    this.request = new AddressRequest();
    this.createRequest = new CreateAddressRequest();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageNumber = 0;
    this.response.pagination.pageSize = 5;
    this.response.pagination.pages = [];
  }

  ngOnInit() {
    this.getAddress();
    this.loadCities();
    // this.calculateShippingFee();
  }
  loadCities() {
    this.ghnService.getProvinces().subscribe((response: any) => {
      this.cities = response.data;
    });
  }

  phoneError: string | null = null;
  fullNameError: string | null = null;

  goToPage(page: number) {
    this.response.pagination.pageNumber = page;
    this.getAddress();
  }
  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const cityId = +selectElement.value;
    this.selectCitys(cityId);
  }

  // Hàm xử lý thay đổi quận
  onDistrictChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const districtId = +selectElement.value;
    this.selectDistricts(districtId);
  }

  // Hàm xử lý thay đổi xã/phường
  onWardChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const wardCode = selectElement.value;
    this.selectWards(wardCode);
  }

  // Hàm chọn thành phố
  selectCitys(ProvinceID: number) {
    console.log(ProvinceID);

    if (ProvinceID) {
      this.ghnService.getDistricts(ProvinceID).subscribe((response: any) => {
        console.log(response);

        this.districts = response.data;
        if (this.cities) {
          this.selectedCity =
            this.cities?.find((city) => city.ProvinceID === ProvinceID) || null;
        }
      });
    }
    console.log('cities', this.cities);
  }

  // Hàm chọn quận
  selectDistricts(DistrictID: number) {
    if (DistrictID) {
      this.ghnService.getWards(DistrictID).subscribe((response: any) => {
        this.wards = response.data;
        this.selectedDistrict =
          this.districts.find(
            (district) => district.DistrictID === DistrictID
          ) || ({} as AddressInfo);
      });
    }
  }

  // Hàm chọn xã/phường
  selectWards(wardCode: string) {
    if (wardCode) {
      this.selectedWard =
        this.wards.find((ward) => ward.WardCode === wardCode) ||
        ({} as AddressInfo);
    }
  }

  nextPage() {
    if (
      this.response.pagination.pageNumber < this.response.pagination.pageTotal
    ) {
      this.response.pagination.pageNumber++;
    }
    this.getAddress();
  }

  previousPage() {
    if (this.response.pagination.pageNumber > 0) {
      this.response.pagination.pageNumber--;
    }
    this.getAddress();
  }

  showDialog() {
    this.request = new AddressRequest();
    this.selectedCity = new AddressInfo();
    this.selectedDistrict = new AddressInfo();
    this.selectedWard = new AddressInfo();
    this.typeSelected = 'H';
    this.isVisible = true;
  }
  validatePhoneNumber(value: string): void {
    const phonePattern = /^(0[1-9]|84[1-9])([0-9]{8,9})$/;
    if (!phonePattern.test(value)) {
      this.phoneError = 'Số điện thoại không hợp lệ';
    } else {
      this.phoneError = null;
    }
  }
  validateInputs(): boolean {
    // Kiểm tra xem đã chọn thành phố (selectedCity) chưa
    if (!this.selectedCity || !this.selectedCity.ProvinceID) {
      this.showError('Vui lòng chọn thành phố.');
      return false;
    }

    // Kiểm tra xem đã chọn quận/huyện (selectedDistrict) chưa (nếu có)
    if (this.selectedCity && !this.selectedDistrict) {
      this.showError('Vui lòng chọn quận/huyện.');
      return false;
    }

    // Kiểm tra xem đã chọn phường/xã (selectedWard) chưa (nếu có)
    if (this.selectedDistrict && !this.selectedWard) {
      this.showError('Vui lòng chọn phường/xã.');
      return false;
    }

    // Kiểm tra xem đã nhập đầy đủ thông tin địa chỉ không
    if (
      !this.createRequest.address ||
      !this.createRequest.fullName ||
      !this.createRequest.numberPhone
    ) {
      this.showError('Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return false;
    }

    // Nếu các điều kiện kiểm tra đều đúng, trả về true để cho phép lưu địa chỉ
    return true;
  }
  saveAddress() {
    this.loading = true;
    // Gán các giá trị từ các đối tượng selectedCity, selectedDistrict, selectedWard
    this.request.fullName = this.request.fullName;
    this.request.ProvinceID = this.selectedCity?.ProvinceID || 0; // GHN uses ProvinceID for cityCode
    this.request.ProvinceName = this.selectedCity?.ProvinceName || '';
    console.log(this.selectedCity);

    if (this.selectedDistrict != null) {
      this.request.DistrictID = this.selectedDistrict.DistrictID || 0; // GHN uses DistrictID for districtCode
      this.request.DistrictName = this.selectedDistrict.DistrictName || '';
    }

    if (this.selectedWard != null) {
      this.request.WardCode = this.selectedWard.WardCode || '0'; // GHN uses WardCode for wardCode
      this.request.WardName = this.selectedWard.WardName || '';
    }

    // Sao chép các giá trị từ input của người dùng
    this.request.address = this.request.address;
    this.request.numberPhone = this.request.numberPhone;
    this.request.addressType = this.typeSelected;
    this.request.isDefault = this.request.isDefault;

    // Gọi service để lưu địa chỉ
    this.addressService.saveAddress(this.request).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<AddressesResponse>;
        this.showSuccess('Lưu Thành Công');
        // this.calculateShippingFee();
        this.getAddress();
        this.isVisible = false;
        this.isEdit = false;
        this.loading = false;
      },
      (error) => {
        if (Array.isArray(error.error)) {
          // Hiển thị từng lỗi
          error.error.forEach((message: string) => {
            this.showError(message);
          });
        } else {
          // Nếu không phải là mảng, hiển thị thông báo lỗi chung
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
      }
    );
  }

  btnUpdate(id: number) {
    this.isEdit = true;
    this.addressService.getAddressById(id).subscribe(
      (data) => {
        const address = data as BaseResponse<AddressResult>;
        console.log(address.data);
        this.baseResponse = data as BaseResponse<AddressesResponse>;
        this.request.fullName = this.baseResponse.data.fullName;
        this.request.numberPhone = this.baseResponse.data.numberPhone;
        this.request.address = this.baseResponse.data.address;
        this.request.isDefault = this.baseResponse.data.isDefault;
        this.disableDefault = this.baseResponse.data.isDefault;
        this.typeSelected = this.baseResponse.data.addressType;
        this.request.id = this.baseResponse.data.id;

        zip([
          this.ghnService.getDistricts(
            Number((address.data as any).provinceID)
          ),
          this.ghnService.getWards(Number((address.data as any).districtID)),
        ]).subscribe((res) => {
          this.districts = (res[0] as any).data;
          this.wards = (res[1] as any).data;

          setTimeout(() => {
            this.selectedProvinceID = Number((address.data as any).provinceID);
            this.selectedDistrictID = Number((address.data as any).districtID);
            this.selectedWardCode = (address.data as any).wardCode;
          }, 5);
        });
        this.isVisible = true;
      },
      (error) => {
        if (Array.isArray(error.error)) {
          // Hiển thị từng lỗi
          error.error.forEach((message: string) => {
            this.showError(message);
          });
        } else {
          // Nếu không phải là mảng, hiển thị thông báo lỗi chung
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'OK',
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }
  getAddress() {
    this.loading = true;
    this.addressService
      .getAddresses(
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<AddressesResponse>;
          this.response.addresses = this.baseResponse.data.addresses;
          this.response.pagination = this.baseResponse.data.pagination;
          this.loading = false;
        },
        (error) => {
          if (Array.isArray(error.error)) {
            // Hiển thị từng lỗi
            error.error.forEach((message: string) => {
              this.showError(message);
            });
          } else {
            // Nếu không phải là mảng, hiển thị thông báo lỗi chung
            this.showError('Có lỗi xảy ra, vui lòng thử lại.');
          }
          this.loading = false;
        }
      );
  }
  setAsDefault(address: AddressResult) {
    this.addressService.setDefaultAddress(address.id).subscribe(
      (response) => {
        this.showSuccess('Đặt địa chỉ mặc định thành công');
        // this.calculateShippingFee();
        this.getAddress(); // Refresh the address list
      },
      (error) => {
        this.showError('Có lỗi xảy ra');
      }
    );
  }
  closeDialog() {
    this.isVisible = false;
    location.reload();
  }
  confirmRemoveAddress(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn xóa?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.addressService.removeAddress(id).subscribe(
          (data) => {
            this.getAddress();
            this.showSuccess('Xóa Thành Công');
          },
          (error) => {
            this.error = error.error as ErrorResponse;
            this.showError(this.error.msgError);
          }
        );
      },
    });
  }

  goBack() {
    const paymentCode = this.tokenStorageService.getCache(this.username);
    if (paymentCode) {
      this.router.navigate(['/payment', paymentCode]);
    }
  }

  reset() {
    this.selectedProvinceID = 0;
    this.selectedDistrictID = 0;
    this.selectedWardCode = '';
  }
}
