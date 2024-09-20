import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerCustomerComponent } from './manager-customer/manager-customer.component';
import { ManagerEmployeeComponent } from './manager-employee/manager-employee.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { DetailEmployeeComponent } from './detail-employee/detail-employee.component';

const routes: Routes = [
  // {
  //   path: 'customer',
  //   component: ManagerCustomerComponent,
  // },
  // {
  //   path: 'employee',
  //   component: ManagerEmployeeComponent,
  // },
  {
    path: 'customer/detail/:id',
    component: DetailCustomerComponent,
  },
  {
    path: 'employee/detail/:id',
    component: DetailEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
