import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileCustomerComponent } from './profile-customer/profile-customer.component';
import { PaymentCustomerComponent } from './payment-customer/payment-customer.component';
import { FavoriteCustomerComponent } from './favorite-customer/favorite-customer.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { ProductCustomerComponent } from './product-customer/product-customer.component';
import { ProductDetailCustomerComponent } from './product-detail-customer/product-detail-customer.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileCustomerComponent,
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'USER_ROLE' },
    loadChildren: () =>
      import('../customer/profile-customer/profile-customer.module').then(
        (x) => x.ProfileCustomerModule
      ),
  },
  {
    path: '',
    component: HomeCustomerComponent,
  },
  {
    path: 'products',
    // canActivate: [AuthGuard, AuthorizationGuard],
    // data: { requiredRole: 'USER_ROLE' },
    component: ProductCustomerComponent,
  },
  {
    path: 'details/:id',
    // canActivate: [AuthGuard, AuthorizationGuard],
    // data: { requiredRole: 'USER_ROLE' },
    component: ProductDetailCustomerComponent,
  },
  {
    path: 'cart',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'USER_ROLE' },
    component: CartDetailsComponent,
  },
  {
    path: 'payment',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'USER_ROLE' },
    component: PaymentCustomerComponent,
  },
  {
    path: 'favorite',
    canActivate: [AuthGuard, AuthorizationGuard],
    data: { requiredRole: 'USER_ROLE' },
    component: FavoriteCustomerComponent,
  },
  // {
  //   path: 'product',
  //   component: ProductCustomerComponent,
  // },
  // {
  //   path: 'product/:type',
  //   component: ProductCustomerComponent,
  // },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
