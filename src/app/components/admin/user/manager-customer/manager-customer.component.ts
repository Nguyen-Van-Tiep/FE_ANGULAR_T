import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { zip } from 'rxjs';
import { CustomerDTO } from 'src/app/commons/dto/CustomerDTO';
import { UserDTO } from 'src/app/commons/dto/UserDTO';
import { AddressInfo } from 'src/app/commons/info/AddressInfo';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { AddressRequest } from 'src/app/commons/request/AddressRequest';
import { CreateAddressRequest } from 'src/app/commons/request/CreateAddressRequest';
import { CreateUserRequest } from 'src/app/commons/request/CreateUserRequest';
import { CustomersRequest } from 'src/app/commons/request/CustomersRequest';
import { AddressesResponse } from 'src/app/commons/response/AddressesResponse';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { CustomerResponse } from 'src/app/commons/response/CustomerResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { AddressResult } from 'src/app/commons/result/AddressResult';
import { BaseResult } from 'src/app/commons/result/BaseResult';
import { env } from 'src/app/environment/env';
import { AddressService } from 'src/app/service/address/address.service';
import { QlyCustomerService } from 'src/app/service/admin/customer/qly-customer.service';
import { GhnService } from 'src/app/service/ghn/ghn.service';
const BASE_STATUS = env.statuses;
const BASE_ADDRESS = env.address;
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-manager-customer',
  templateUrl: './manager-customer.component.html',
  styleUrl: './manager-customer.component.css',
})
export class ManagerCustomerComponent implements OnInit {
  searchValue: string = '';
  users: any;
  selectedUser: any;
  @ViewChild('dt1') dt1!: Table;
  selectedStatus: string = '';
  fromDate!: Date | null;
  toDate!: Date | null;
  statusOptions: SelectItem[];
  isDisable: Boolean = false;
  pagination: PaginationInfo;
  loading: boolean = false;
  baseResponse: BaseResponse<any>;
  response: CustomerDTO = new CustomerDTO();
  inForesponse: UserInfoResponse = new UserInfoResponse();
  userResponse: UserDTO = new UserDTO();
  birthOfDateTemp: Date | null = null; //

  request: CustomersRequest = new CustomersRequest();
  createRequest: CreateUserRequest = new CreateUserRequest();
  result: CustomerResponse = new CustomerResponse();
  sortField: string = '';
  sortOrder: string = '';
  error: ErrorResponse;
  statuses: typeof BASE_STATUS;
  status: BaseResult;
  first: number = 0;
  displayAddCustomerDialog: boolean = false;
  showEditDialog: boolean = false;
  blockSpace: RegExp = /[^s]/;
  isValid: Boolean = true;
  filteredUsers: CustomerDTO[] = []; // Thay User[] bằng kiểu dữ liệu của đối tượng người dùng của bạn

  //address
  //addressForm: FormGroup;
  selectedProvinceID!: number;
  selectedDistrictID!: number;
  selectedWardCode!: string;
  cities: AddressInfo[];
  addressResponse: AddressesResponse = new AddressesResponse();
  disableDefault: boolean = false;
  isVisible: boolean = false;
  addressRequest: AddressRequest = new AddressRequest();
  createAddressRequest: CreateAddressRequest = new CreateAddressRequest();
  showAddressDialog: boolean = false;
  typeSelected: string = 'H';
  addressType: any[] = [
    { name: 'Nhà riêng', value: 'H' },
    { name: 'Công ty', value: 'C' },
    { name: 'Khác', value: 'O' },
  ];
  addressses: typeof BASE_ADDRESS;
  // cities: AddressInfo[];
  selectedCity: AddressInfo | null = null;
  districts: AddressInfo[];
  selectedDistrict: AddressInfo | null = null;
  wards: AddressInfo[];
  selectedWard: AddressInfo | null = null;
  selectedAddress: AddressInfo | null = null;
  // isEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ghnService: GhnService,
    private customerService: QlyCustomerService,
    private addressService: AddressService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.statusOptions = [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Inactive', value: 'INACTIVE' },
    ];
    this.error = new ErrorResponse();
    this.baseResponse = new BaseResponse();
    this.pagination = new PaginationInfo();
    this.pagination.pageCount = 1;
    this.pagination.pageFirst = 1;
    this.pagination.pageLast = 2;
    this.pagination.pageSize = 10;
    this.pagination.pageNumber = 0;
    this.result.pagination = new PaginationInfo();
    this.result.pagination.pageNumber = 0;
    this.result.pagination.pageSize = 10;
    this.statuses = BASE_STATUS;
    this.status = this.statuses[0];
    //address
    this.addressses = BASE_ADDRESS;
    this.cities = [];
    // this.cities = this.addressses.filter((address) => address.parentId === 0);
    this.selectedCity = new AddressInfo();
    this.districts = [];
    this.selectedDistrict = new AddressInfo();
    this.wards = [];
    this.selectedWard = new AddressInfo();
    this.addressRequest = new AddressRequest();
    this.createAddressRequest = new CreateAddressRequest();
    this.addressResponse.pagination = new PaginationInfo();
    this.addressResponse.pagination.pageNumber = 0;
    this.addressResponse.pagination.pageSize = 5;
    this.addressResponse.pagination.pages = [];
  }
  ngOnInit(): void {
    this.getCustomer();
    this.loadCities();
  }
  showAddCustomerDialog() {
    this.displayAddCustomerDialog = true;
  }
  usernameError: string | null = null;
  phoneError: string | null = null;
  emailError: string | null = null;
  fullnameError: string | null = null;

  validateUsername(value: string): void {
    const userPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!userPattern.test(value)) {
      this.usernameError = 'Tài khoản không hợp lệ';
    } else {
      this.usernameError = null;
    }
  }
  validateEmail(value: string): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailPattern.test(value)) {
      this.emailError = 'Email không hợp lệ';
    } else {
      this.emailError = null;
    }
  }
  validatePhoneNumber(value: string): void {
    const phonePattern = /^(0[1-9]|84[1-9])([0-9]{8,9})$/;
    if (!phonePattern.test(value)) {
      this.phoneError = 'Số điện thoại không hợp lệ';
    } else {
      this.phoneError = null;
    }
  }
  validateFullName(value: string) {
    if (this.createRequest.fullName.trim().length < 8) {
      this.fullnameError = 'Họ tên phải nhập đầy đủ';
    } else {
      this.fullnameError = null;
    }
  }
  isFormValid(): boolean {
    return (
      !!this.createRequest.username &&
      !!this.createRequest.fullName &&
      !!this.createRequest.gender &&
      !!this.createRequest.birthOfDate &&
      !!this.createRequest.numberPhone &&
      !!this.createRequest.email
    );
  }
  addUserCustomer() {
    this.loading = true;
    this.validateEmail(this.createRequest.email);
    this.validatePhoneNumber(this.createRequest.numberPhone);
    this.validateUsername(this.createRequest.username);
    this.validateFullName(this.createRequest.fullName);

    if (
      this.usernameError ||
      this.phoneError ||
      this.emailError ||
      this.fullnameError
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thêm mới thất bại',
        detail: 'Vui lòng kiểm tra lại các thông tin đã nhập.',
      });
      return;
    }

    this.customerService.createUser(this.createRequest).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<CustomerResponse>;
        this.messageService.add({
          severity: 'success',
          summary: 'Thêm mới thành công !',
        });
        this.getCustomer();
        this.loading = false;
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Thêm mới thất bại !',
          detail: this.error.msgError,
        });
        this.loading = false;
      }
    );
    this.displayAddCustomerDialog = false;
    this.resetFormCreateUser();
  }
  resetFormCreateUser() {
    this.createRequest = new CreateUserRequest();
  }
  applyFilterGlobal(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const searchValue = target.value.trim().toLowerCase();
      const regex = new RegExp(`\\b${searchValue}\\b`, 'i'); // Tạo Regex từ searchValue
      this.filteredUsers = this.users.filter(
        (user: UserDTO) =>
          user.fullName.toLowerCase().match(regex) ||
          user.numberPhone.toLowerCase().match(regex) ||
          user.email.toLowerCase().match(regex) ||
          (user.birthOfDate instanceof Date &&
            user.birthOfDate.toLocaleDateString().toLowerCase().match(regex)) ||
          user.gender.toLowerCase().match(regex) ||
          user.status.toLowerCase().match(regex)
      );
      //Áp dụng lại bộ lọc vào bảng

      this.dt1.filter(this.filteredUsers, 'global', 'contains');
      this.dt1.reset();
    }
  }
  applyFilter() {
    this.filteredUsers = this.users.filter((user: UserDTO) => {
      let matchesStatus = true;
      let matchesDateRange = true;
      let matchesSearchValue = true;

      if (this.selectedStatus) {
        matchesStatus = user.status === this.selectedStatus;
      }

      if (this.fromDate && this.toDate) {
        const userDate = new Date(user.birthOfDate);
        matchesDateRange = userDate >= this.fromDate && userDate <= this.toDate;
      }

      if (this.searchValue) {
        const searchTerm = this.searchValue.toLowerCase();
        matchesSearchValue =
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.numberPhone.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.gender.toLowerCase().includes(searchTerm) ||
          user.birthOfDate.toString().includes(searchTerm) || // Chuyển đổi Date thành chuỗi
          user.status.toLowerCase().includes(searchTerm);
      }

      console.log('Filtered Users:', this.filteredUsers);
      return matchesStatus && matchesDateRange && matchesSearchValue;
    });
  }
  getUsers() {
    this.loading = true;
    this.customerService.getAllCustomer().subscribe(
      (data) => {
        // Giả sử dữ liệu trả về nằm trong thuộc tính `data`
        this.baseResponse = data as BaseResponse<CustomerDTO>;
        this.users = this.baseResponse.data;
        this.loading = false;
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Hiển thị thất bại !',
          detail: this.error.msgError,
        });
        this.loading = false;
      }
    );
  }
  getCustomer() {
    this.loading = true;
    this.request.name = this.searchValue;
    this.customerService
      .getCustomers(
        this.request,
        this.result.pagination.pageNumber,
        this.result.pagination.pageSize,
        this.sortField,
        this.sortOrder
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<CustomerResponse>;
          this.result.customers = this.baseResponse.data.customers;
          this.result.pagination = this.baseResponse.data.pagination;
          this.users = this.result.customers;
          this.pagination = this.result.pagination;
          this.loading = false;
        },
        (error) => {
          this.error = error.error as ErrorResponse;
          this.messageService.add({
            severity: 'error',
            summary: 'Phân trang thất bại !',
            detail: this.error.msgError,
          });
          this.loading = false;
        }
      );
  }
  paginate(event: any) {
    this.first = event.first;
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.result.pagination.pageSize = size;
    this.result.pagination.pageNumber = page;
    this.pagination.pageNumber = event.page; // Cập nhật số trang hiện tại
    this.pagination.pageSize = event.rows;
    this.getCustomer();
  }

  onSort(event: any) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';
    if (sortField !== this.sortField || sortOrder !== this.sortOrder) {
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.getCustomer();
    }
  }
  onStatusChange(user: any) {
    this.loading = true;
    const updatedStatus = user.status;
    this.customerService.updateStatus(user.id, updatedStatus).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật trạng thái thành công!',
          detail: 'Trạng thái của người dùng đã được cập nhật.',
        });
        this.getCustomer();
        this.loading = false;
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Cập nhật trạng thái thất bại!',
          detail: this.error.msgError,
        });
        this.loading = false;
      }
    );
  }
  editUser(id: number) {
    this.getUserInfo(id); // Load user info before showing the edit dialog
    this.showEditDialog = true; // Show edit dialog
  }

  getUserInfo(id: number): void {
    this.customerService.getUserInfo(id).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<UserDTO>;
        this.userResponse = {
          ...this.baseResponse.data,
          fullName: this.baseResponse.data.fullName || '',
          birthOfDate: new Date(this.baseResponse.data.birthOfDate),
        }; // Assuming 'data' contains the actual user info
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Error fetching user info!',
          detail: this.error.msgError,
        });
      }
    );
  }
  edit() {
    //this.isDisable = !this.isDisable;
    this.showEditDialog = false;
  }
  saveChanges(id: number) {
    this.loading = true;
    this.customerService
      .updateUser(this.userResponse, this.userResponse.id)
      .subscribe(
        (response) => {
          this.isDisable = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Chỉnh sửa thành công!',
          });
          this.showEditDialog = false;
          this.loading = false;
          // this.isDisable = !this.isDisable;
          this.getCustomer();
          //location.reload();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Chỉnh sửa thất bại!',
            detail: this.error.msgError,
          });
          this.loading = false;
        }
      );
  }
  formatMyDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  validate(key: string) {
    if (!key || key.trim() === '') {
      this.isValid = false;
    }
    this.isValid = true;
  }
  //address
  addressInfo(id: number) {
    this.getAddress(id);
    //this.addressRequest.userID = id;
    this.showAddressDialog = true;
  }
  goToPage(page: number) {
    this.addressResponse.pagination.pageNumber = page;
    this.getAddress(this.addressResponse.userID);
  }

  nextPage() {
    if (
      this.addressResponse.pagination.pageNumber <
      this.addressResponse.pagination.pageTotal
    ) {
      this.addressResponse.pagination.pageNumber++;
    }
    this.getAddress(this.addressResponse.userID);
  }

  previousPage() {
    if (this.addressResponse.pagination.pageNumber > 0) {
      this.addressResponse.pagination.pageNumber--;
    }
    this.getAddress(this.addressResponse.userID);
  }
  showDialog(id: number) {
    this.addressRequest = new AddressRequest();
    this.addressRequest.id = 0;
    this.selectedCity = new AddressInfo();
    this.selectedDistrict = new AddressInfo();
    this.selectedWard = new AddressInfo();
    this.typeSelected = 'H';
    this.isVisible = true;
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
      !this.addressRequest.address ||
      !this.addressRequest.fullName ||
      !this.addressRequest.numberPhone
    ) {
      this.showError('Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return false;
    }

    // Nếu các điều kiện kiểm tra đều đúng, trả về true để cho phép lưu địa chỉ
    return true;
  }
  btnUpdate(id: number) {
    this.addressService.getAddressById(id).subscribe(
      (data) => {
        const address = data as BaseResponse<AddressResult>;
        console.log(address.data);
        this.baseResponse = data as BaseResponse<AddressesResponse>;
        this.addressRequest.fullName = this.baseResponse.data.fullName;
        this.addressRequest.numberPhone = this.baseResponse.data.numberPhone;
        this.addressRequest.address = this.baseResponse.data.address;
        this.addressRequest.isDefault = this.baseResponse.data.isDefault;
        this.disableDefault = this.baseResponse.data.isDefault;
        this.typeSelected = this.baseResponse.data.addressType;
        this.addressRequest.id = this.baseResponse.data.id;

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
  loadCities() {
    this.ghnService.getProvinces().subscribe((response: any) => {
      this.cities = response.data;
    });
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
  saveAddress() {
    this.loading = true;
    this.showAddressDialog = true;
    this.validateInputs();
    this.addressRequest.fullName = this.addressRequest.fullName;
    this.addressRequest.ProvinceID = this.selectedCity?.ProvinceID || 0; // GHN uses ProvinceID for cityCode
    this.addressRequest.ProvinceName = this.selectedCity?.ProvinceName || '';
    if (this.selectedDistrict != null) {
      this.addressRequest.DistrictID = this.selectedDistrict.DistrictID || 0; // GHN uses DistrictID for districtCode
      this.addressRequest.DistrictName =
        this.selectedDistrict.DistrictName || '';
    }
    if (this.selectedWard != null) {
      this.addressRequest.WardCode = this.selectedWard.WardCode || '0'; // GHN uses WardCode for wardCode
      this.addressRequest.WardName = this.selectedWard.WardName || '';
    }
    this.addressRequest.address = this.addressRequest.address;
    this.addressRequest.numberPhone = this.addressRequest.numberPhone;
    this.addressRequest.addressType = this.typeSelected;
    this.addressRequest.isDefault = this.addressRequest.isDefault;
    this.addressService
      .saveAddressID(this.addressResponse.userID, this.addressRequest)
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<AddressesResponse>;
          this.showSuccess('Lưu Thành Công');
          this.getAddress(this.addressResponse.userID);
          this.isVisible = false;
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
  // onSubmit(form: NgForm) {
  //   if (form.valid) {
  //     this.saveAddress(this.addressRequest.id);
  //   } else {
  //     this.showError(
  //       'Form không hợp lệ. Vui lòng kiểm tra lại các trường nhập.'
  //     );
  //   }
  // }
  getAddress(id: number) {
    this.loading = true;
    this.addressService
      .getAddressesID(
        id,
        this.addressResponse.pagination.pageNumber,
        this.addressResponse.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<AddressesResponse>;
          this.addressResponse.addresses = this.baseResponse.data.addresses;
          this.addressResponse.pagination = this.baseResponse.data.pagination;
          this.addressResponse.userID = id;
          this.loading = false;
        },
        (error) => {
          this.error = error.error as ErrorResponse;
          this.showError(this.error.msgError);
          this.loading = false;
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
  setAsDefault(address: AddressResult) {
    this.addressService
      .setDefaultAddressID(address.id, this.addressResponse.userID)
      .subscribe(
        (response) => {
          this.showSuccess('Đặt địa chỉ mặc định thành công');
          this.getAddress(this.addressResponse.userID); // Refresh the address list
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
            this.showSuccess('Xóa Thành Công');
            this.getAddress(this.addressResponse.userID);
          },
          (error) => {
            this.error = error.error as ErrorResponse;
            this.showError(this.error.msgError);
          }
        );
      },
    });
  }
  reset() {
    this.selectedProvinceID = 0;
    this.selectedDistrictID = 0;
    this.selectedWardCode = '';
  }
}
