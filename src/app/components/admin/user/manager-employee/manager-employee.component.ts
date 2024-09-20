import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EmployeeDTO } from 'src/app/commons/dto/EmployeeDTO';
import { UserDTO } from 'src/app/commons/dto/UserDTO';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { EmployeeRequest } from 'src/app/commons/request/EmployeeRequest';
import { EmployeesRequest } from 'src/app/commons/request/EmployeesRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { EmployeeResponse } from 'src/app/commons/response/EmployeeResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { BaseResult } from 'src/app/commons/result/BaseResult';
import { env } from 'src/app/environment/env';
import { EmployeesService } from 'src/app/service/admin/employee/employees.service';
const BASE_STATUS = env.statuses;
@Component({
  selector: 'app-manager-employee',
  templateUrl: './manager-employee.component.html',
  styleUrl: './manager-employee.component.css',
})
export class ManagerEmployeeComponent implements OnInit {
  sortField: string = '';
  sortOrder: string = '';
  searchValue: string = '';
  users: any;
  baseResponse: BaseResponse<any>;
  employeeRequest: EmployeeRequest = new EmployeeRequest();
  response: EmployeeDTO = new EmployeeDTO();
  request: EmployeesRequest = new EmployeesRequest();
  result: EmployeeResponse = new EmployeeResponse();
  pagination: PaginationInfo;
  loading: boolean = false;
  actionInfo: string = 'Thêm mới nhân viên';
  isVisible: boolean = false;
  user: any;
  file: File | null = null;
  isValid: Boolean = true;
  statuses: typeof BASE_STATUS;
  status: BaseResult;
  error: ErrorResponse;
  isDisable: Boolean = false;
  showEditDialog: boolean = false;
  filteredUsers: EmployeeDTO[] = [];
  //editForm: FormGroup;
  @ViewChild('dt1') dt1!: Table;
  constructor(
    private confirmationService: ConfirmationService,
    private employeeService: EmployeesService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.error = new ErrorResponse();
    this.baseResponse = new BaseResponse();
    this.result.pagination = new PaginationInfo();
    this.result.pagination.pageNumber = 0;
    this.result.pagination.pageSize = 10;
    this.pagination = new PaginationInfo();
    this.pagination.pageCount = 1;
    this.pagination.pageFirst = 1;
    this.pagination.pageLast = 2;
    this.pagination.pageSize = 10;
    this.pagination.pageNumber = 0;
    this.statuses = BASE_STATUS;
    this.status = this.statuses[0];
    // this.editForm = this.fb.group({
    //   // Define your form controls here
    //   username: [''], // Example control
    //   fullName: ['', Validators.required], // Example control
    //   email: ['', [Validators.required, Validators.email]],
    //   // Add other form controls as needed
    // });
    //this.user = this.users[0];
  }
  ngOnInit(): void {
    this.getEmployee();
  }
  usernameError: string | null = null;
  phoneError: string | null = null;
  passwordError: string | null = null;
  emailError: string | null = null;
  fullnameError: string | null = null;
  confirmPasswordError: string | null = null;

  validateUsername(value: string): void {
    const userPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!userPattern.test(value)) {
      this.usernameError = 'Tài khoản không hợp lệ';
    } else {
      this.usernameError = null;
    }
  }
  validateFullName(fullName: string) {
    if (!fullName || fullName.trim().length === 0) {
      this.fullnameError = 'Họ và tên không được để trống';
      this.isValid = false;
    } else {
      this.fullnameError = '';
    }
  }

  validateNumberPhone(numberPhone: string) {
    const phonePattern = /^(0[1-9]|84[1-9])([0-9]{8,9})$/; // Giả sử số điện thoại phải có 10 chữ số
    if (!numberPhone || !phonePattern.test(numberPhone)) {
      this.phoneError = 'Số điện thoại không hợp lệ';
      this.isValid = false;
    } else {
      this.phoneError = '';
    }
  }

  validateEmail(email: string) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!email || !emailPattern.test(email)) {
      this.emailError = 'Email không hợp lệ';
      this.isValid = false;
    } else {
      this.emailError = '';
    }
  }
  validatePassword(password: string) {
    if (!password || password.length < 8) {
      this.passwordError = 'Mật khẩu phải có ít nhất 8 ký tự';
      this.isValid = false;
    } else {
      this.passwordError = '';
    }
    //this.checkFormValidity();
  }

  validateConfirmPassword(confirmPassword: string) {
    if (confirmPassword !== this.employeeRequest.password) {
      this.confirmPasswordError = 'Xác nhận mật khẩu không khớp';
      this.isValid = false;
    } else {
      this.confirmPasswordError = '';
    }
    //this.checkFormValidity();
  }

  showDialog() {
    this.employeeRequest = new EmployeeRequest();
    this.isVisible = true;
  }
  editUser(id: number) {
    this.getUserInfo(id); // Load user info before showing the edit dialog
    this.showEditDialog = true; // Show edit dialog
  }
  validate(key: string) {
    if (!key || key.trim() === '') {
      this.isValid = false;
    }
    this.isValid = true;
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
          // (user.birthOfDate instanceof Date &&
          //   user.birthOfDate.toLocaleDateString().toLowerCase().match(regex)) ||
          user.birthOfDate.toString().toLowerCase().match(regex) ||
          user.gender.toLowerCase().match(regex) ||
          user.status.toLowerCase().match(regex)
      );
      //Áp dụng lại bộ lọc vào bảng

      this.dt1.filter(this.filteredUsers, 'global', 'contains');
      this.dt1.reset();
    }
  }
  getUserInfo(id: number): void {
    this.employeeService.getUserInfo(id).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<EmployeeDTO>;
        this.response = {
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
  validateForm() {
    this.isValid = true; // Reset isValid trước khi validate
    this.validateFullName(this.employeeRequest.fullName);
    this.validateNumberPhone(this.employeeRequest.numberPhone);
    this.validateEmail(this.employeeRequest.email);
  }
  saveChanges(id: number) {
    this.loading = true;
    this.validateForm();
    this.employeeService.updateUser(this.response, this.response.id).subscribe(
      (response) => {
        this.isDisable = false;
        this.isValid = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Chỉnh sửa thành công!',
        });
        this.showEditDialog = false;
        this.loading = false;
        // this.isDisable = !this.isDisable;
        this.getEmployee();
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
  onStatusChange(user: any) {
    this.loading = true;
    const updatedStatus = user.status;
    this.employeeService.updateStatus(user.id, updatedStatus).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật trạng thái thành công!',
          detail: 'Trạng thái của người dùng đã được cập nhật.',
        });
        this.getEmployee();
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
  getEmployee() {
    this.loading = true;
    this.request.name = this.searchValue;
    this.employeeService
      .getEmployees(
        this.request,
        this.result.pagination.pageNumber,
        this.result.pagination.pageSize,
        this.sortField,
        this.sortOrder
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<EmployeeResponse>;
          this.result.employees = this.baseResponse.data.employees;
          this.result.pagination = this.baseResponse.data.pagination;
          this.users = this.result.employees;
          this.pagination = this.result.pagination;
          this.loading = false;
        },
        (error) => {
          console.error('Error searching employee:', error);
          this.loading = false;
        }
      );
  }

  getUsers() {
    this.loading = true;
    this.employeeService.getAllEmployee().subscribe(
      (data) => {
        // Giả sử dữ liệu trả về nằm trong thuộc tính `data`
        this.baseResponse = data as BaseResponse<EmployeeDTO>;
        this.users = this.baseResponse.data;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }
  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.result.pagination.pageSize = size;
    this.result.pagination.pageNumber = page;
    this.getEmployee();
  }

  onSort(event: any) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';
    if (sortField !== this.sortField || sortOrder !== this.sortOrder) {
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.getEmployee();
    }
  }

  chooseFile(event: any) {
    // Lưu các tệp đã chọn vào mảng files
    if (event.target.files && event.target.files.length > 0) {
      // Lưu các tệp đã chọn vào mảng files
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const objectURL = URL.createObjectURL(file);
        this.file = file;
        this.employeeRequest.img = `url(${objectURL})`;
      }
      // Bật nút "Clear" khi có tệp được ch
    }
  }

  removeImage() {
    this.file = new File([], '');
    this.user.img = '../../../../assets/img/background/blank-image.svg';
  }

  saveUser() {
    this.isValid = true;
    this.validateFullName(this.employeeRequest.fullName);
    this.validateNumberPhone(this.employeeRequest.numberPhone);
    this.validateEmail(this.employeeRequest.email);
    this.validatePassword(this.employeeRequest.password);
    this.validateConfirmPassword(this.employeeRequest.confirmPassword);
    this.validateUsername(this.employeeRequest.username);
    if (!this.isValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Dữ liệu không hợp lệ',
        detail: 'Vui lòng kiểm tra lại các thông tin và thử lại.',
      });
      return; // Dừng quá trình lưu
    }
    this.isVisible = true;
    this.employeeRequest.status = this.status.code;
    this.employeeService.getCreate(this.employeeRequest).subscribe(
      (data) => {
        this.isVisible = false;
        this.baseResponse = data as BaseResponse<EmployeeDTO>;
        this.users = this.baseResponse.data;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Thêm nhân viên thành công!',
        });
        this.getEmployee(); // Refresh the employee list
      },
      (error) => {
        this.loading = false;
        this.isValid = false;
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Thêm nhân viên thất bại!',
          detail: this.error.msgError,
        });
      }
    );
  }

  confirmLokedUserEmployee(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn khóa tài khoản này không?',
      header: 'Xác nhận khóa tài khoản',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.employeeService.lockedEmployee(id).subscribe(
          (data) => {
            this.getEmployee();
            this.messageService.add({
              severity: 'error',
              summary: 'Khóa tài khoản thành công !',
              detail: this.error.msgError,
            });
          },
          (error) => {
            this.error = error.error as ErrorResponse;
            this.messageService.add({
              severity: 'error',
              summary: 'Khóa tài khoản thất bại !',
              detail: this.error.msgError,
            });
          }
        );
      },
    });
  }

  confirmRemoveEmployee(event: Event, id: number) {
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
        this.employeeService.removeEmployee(id).subscribe(
          (data) => {
            this.getEmployee();
            this.messageService.add({
              severity: 'error',
              summary: 'Xóa thành công !',
              detail: this.error.msgError,
            });
          },
          (error) => {
            this.error = error.error as ErrorResponse;
            this.messageService.add({
              severity: 'error',
              summary: 'Xóa thất bại !',
              detail: this.error.msgError,
            });
          }
        );
      },
    });
  }
}
