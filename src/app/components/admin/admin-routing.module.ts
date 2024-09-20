import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { OrderDetailAdminComponent } from './order-detail-admin/order-detail-admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { ManagerProductComponent } from './admin-product/manager-product/manager-product.component';
import { AddProductComponent } from './admin-product/add-product/add-product.component';
import { ManagerEmployeeComponent } from './user/manager-employee/manager-employee.component';
import { ManagerCustomerComponent } from './user/manager-customer/manager-customer.component';
import { UserModule } from '../admin/user/user.module';
import { UserComponent } from './user/user.component';
import { BrandComponent } from './brand/brand.component';
import { ColorComponent } from './color/color.component';
import { MaterialComponent } from './material/material.component';
import { SizeComponent } from './size/size.component';
import { SoleComponent } from './sole/sole.component';
import { StyleComponent } from './style/style.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: DashboardComponent,
  },
  {
    path: 'brand',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: BrandComponent,
  },
  {
    path: 'color',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: ColorComponent,
  },
  {
    path: 'material',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: MaterialComponent,
  },
  {
    path: 'size',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: SizeComponent,
  },
  {
    path: 'sole',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: SoleComponent,
  },
  {
    path: 'style',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: StyleComponent,
  },
  {
    path: 'products',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: AdminProductComponent,
  },
  // {
  //   path: 'employee',
  //   canActivate: [AuthGuard, AuthorizationGuard],
  //   data: { requiredRole: 'ADMIN_ROLE' },
  //   component: ManagerEmployeeComponent,
  // },
  // {
  //   path: 'customer',
  //   canActivate: [AuthGuard, AuthorizationGuard],
  //   data: { requiredRole: 'ADMIN_ROLE' },
  //   component: ManagerCustomerComponent,
  // },
  {
    path: 'manager-product/:id',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: ManagerProductComponent,
  },
  {
    path: 'add-product',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: AddProductComponent,
  },
  // {
  //   path: 'product',
  //   component: AdminProductComponent,
  //   loadChildren: () =>
  //     import('../admin/admin-product/admin-product.module').then(
  //       (x) => x.AdminProductModule
  //     ),
  // },
  {
    path: 'order',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: OrderAdminComponent,
  },
  {
    path: 'order/detail/:code',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: OrderDetailAdminComponent,
  },
  // {
  //   path: 'user',
  //   component: UserComponent,
  //   loadChildren: () =>
  //     import('../admin/user/user.module').then((x) => x.UserModule),
  // },
  {
    path: 'customer',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: ManagerCustomerComponent,
  },
  {
    path: 'employee',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'ADMIN_ROLE' },
    component: ManagerEmployeeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
