import { Component, OnInit, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css',
})
export class SidebarAdminComponent implements OnInit {
  sidebarVisible: boolean = true;
  items: any;
  isProductMenuOpen = false;

  toggleProductMenu() {
      this.isProductMenuOpen = !this.isProductMenuOpen;
  }
  ngOnInit() {
    this.items = [
      {
        label: 'Người dùng',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Nhân viên',
            route: '/admin/user/employee',
          },
          {
            label: 'Khách hàng',
            route: '/admin/user/customer',
          },
        ],
      },
    ];
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }
}
