import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthComponent } from './components/auth/auth.component';
import { CustomerComponent } from './components/customer/customer.component';
import { AuthGuard } from './components/auth/auth.guard';
import { AuthorizationGuard } from './components/auth/authorization.guard';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  {
    path:'auth',
    component:AuthComponent,
    loadChildren:() =>import('./components/auth/auth.module').then(x=>x.AuthModule)
  },
  // {
  //   path:'',
  //   component: CustomerComponent, canActivate :[AuthGuard, AuthorizationGuard], data:{requiredRole: 'user'}
  // },
  {
    path:'',
    component: CustomerComponent,
    loadChildren:() =>import('./components/customer/customer.module').then(x=>x.CustomerModule)
  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren:() =>import('./components/admin/admin.module').then(x=>x.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top' // Tùy chọn này giúp cuộn lên đầu trang
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
