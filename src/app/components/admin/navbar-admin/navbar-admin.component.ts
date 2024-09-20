import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { MessageService } from 'primeng/api';
import { EmployeesService } from 'src/app/service/admin/employee/employees.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'admin-navbar',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css',
})
export class NavbarAdminComponent implements OnInit {
  user: any = {
    username: '',
    role: '',
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
      if (Array.isArray(this.user.data.role)) {
        this.user.data.role = this.convertRole(this.user.data.role[0]);
      } else {
        this.user.data.role = this.convertRole(this.user.data.role);
      }
    }
  }
  convertRole(role: string): string {
    if (role === 'ADMIN_ROLE') {
      return 'Nhân viên';
    }
    return role; // Trả về giá trị role gốc nếu không phải là ADMIN_ROLE
  }
  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'thực hiện thành công',
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
  logout() {
    this.authService.logoutAdmin(false);
    this.showSuccess('Đăng xuất thành công');
  }
}
