import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ChangePasswordRequest } from 'src/app/commons/request/ChangePassword';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { ResetPasswordService } from 'src/app/service/auth/reset-password/reset-password.service';
import { UserService } from 'src/app/service/user/user.service';
@Component({
  selector: 'app-side-bar-profile',
  templateUrl: './side-bar-profile.component.html',
  styleUrl: './side-bar-profile.component.css',
})
export class SideBarProfileComponent implements OnInit {
  items: MenuItem[];
  response: UserInfoResponse;
  pageRouter: number = 0;
  visible: boolean = false;
  request: ChangePasswordRequest;
  userResponse: BaseResponse<UserInfoResponse>;
  error: ErrorResponse;
  constructor(
    private router: Router,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private resetPasswordService: ResetPasswordService
  ) {
    this.request = new ChangePasswordRequest();
    this.response = new UserInfoResponse();
    this.response.image =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbWUrz_YnQA985GqdPbHMOtGMBlwrs5Qe4nA&s';
    this.userResponse = new BaseResponse<UserInfoResponse>();
    this.error = new ErrorResponse();
    this.items = [
      {
        label: 'Thông tin chung',
        icon: 'fa fa-address-card',
        command: () => {
          this.router.navigate(['/profile/general']);
        },
      },
      {
        label: 'Địa Chỉ',
        icon: 'fa fa-location-arrow',
        command: () => {
          this.router.navigate(['/profile/address']);
        },
      },
      {
        label: 'Đơn Hàng',
        icon: 'fa fa-shopping-cart',
        items: [
          {
            label: 'Đã đặt hàng',
            icon: 'fa fa-hourglass-start',
            command: () => {
              this.router.navigate(['/profile/order/status/P']);
            },
          },
          {
            label: 'Chờ vận chuyển',
            icon: 'fa fa-clock',
            command: () => {
              this.router.navigate(['/profile/order/status/W']);
            },
          },
          {
            label: 'Đang giao hàng',
            icon: 'fa fa-truck',
            command: () => {
              this.router.navigate(['/profile/order/status/T']);
            },
          },
          {
            label: 'Hoàn thành',
            icon: 'fa fa-check-circle',
            command: () => {
              this.router.navigate(['/profile/order/status/F']);
            },
          },
        ],
      },
      {
        label: 'Đổi Mật Khẩu',
        icon: 'fa fa-pencil',
        command: () => {
          this.visible = true;
        },
      },
    ];
  }

  ngOnInit() {
    this.hightline();
    this.getUserInfo();
  }
  getUserInfo(): void {
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.userResponse = data as BaseResponse<UserInfoResponse>;
        this.response = {
          ...this.userResponse.data,
          fullName: this.userResponse.data.fullName || '',
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
  hightline() {
    if (this.router.url.includes('address')) {
      this.items[1].expanded = true;
    } else if (this.router.url.includes('order')) {
      const expanded = !this.items[2].expanded;
      this.items[2] = this.toggleMenuItem(this.items[2], expanded);
      if (this.router.url.includes('processing')) {
        this.setExpanded(this.items, 2, 0, true);
      } else if (this.router.url.includes('transporting')) {
        this.setExpanded(this.items, 2, 1, true);
      } else if (this.router.url.includes('done')) {
        this.setExpanded(this.items, 2, 2, true);
      } else if (this.router.url.includes('cancel')) {
        this.setExpanded(this.items, 2, 3, true);
      } else if (this.router.url.includes('refund')) {
        this.setExpanded(this.items, 2, 4, true);
      }
    } else if (this.router.url.includes('order-detail')) {
      this.items[2] = this.toggleMenuItem(this.items[2], false);
    } else {
      this.items[0].expanded = true;
    }
  }

  private toggleMenuItem(item: MenuItem, expanded: boolean): MenuItem {
    item.expanded = expanded;
    if (item.items) {
      item.items = item.items.map((subItem) =>
        this.toggleMenuItem(subItem, expanded)
      );
    }
    return item;
  }

  setExpanded(
    menuItems: MenuItem[],
    menuIndex: number,
    itemIndex: number,
    expanded: boolean
  ) {
    if (menuItems && menuIndex !== undefined && itemIndex !== undefined) {
      const menuItem = menuItems[menuIndex];
      if (menuItem && menuItem.items) {
        const subMenuItem = menuItem.items[itemIndex];
        if (subMenuItem) {
          subMenuItem.expanded = expanded;
          subMenuItem.styleClass = 'p-focus';
        }
      }
    }
  }

  closeDialog() {
    this.visible = false;
    location.reload();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.visible) {
      this.visible = false;
      this.hightline();
      this.items[3].expanded = false;
    }
  }
  resetForm() {
    this.request = new ChangePasswordRequest();
  }
  validatePasswords(): boolean {
    if (this.request.newPassword !== this.request.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu xác nhận không khớp',
      });
      return false;
    }
    // Add more validation logic here if needed
    return true;
  }
  confirmChangePassword(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc muốn thay đổi mật khẩu?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.validatePasswords()) {
          this.resetPasswordService.changePassword(this.request).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Mật khẩu đã được thay đổi thành công',
              });
              this.closeDialog();
            },
            error: (err) => {
              if (Array.isArray(err.error)) {
                // Hiển thị từng lỗi
                err.error.forEach((message: string) => {
                  this.showError(message);
                });
              } else {
                // Nếu không phải là mảng, hiển thị thông báo lỗi chung
                this.showError('Có lỗi xảy ra, vui lòng thử lại.');
              }
            },
          });
        }
      },
    });
  }
  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }
}
