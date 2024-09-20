import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralCustomerComponent } from './general-customer/general-customer.component';
import { AddressCustomerComponent } from './address-customer/address-customer.component';
import { OrderCustomerComponent } from './order-customer/order-customer.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';

const routes: Routes = [
  {
    path: 'general',
    component: GeneralCustomerComponent,
  },
  {
    path: 'address',
    component: AddressCustomerComponent,
  },
  {
    path: 'order/status/:status',
    component: OrderCustomerComponent,
  },

  {
    path: 'order-detail/:code',
    component: DetailOrderComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileCustomerRoutingModule {}
