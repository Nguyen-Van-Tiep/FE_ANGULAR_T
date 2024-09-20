import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { DetailEmployeeComponent } from './detail-employee/detail-employee.component';
import { ManagerEmployeeComponent } from './manager-employee/manager-employee.component';
import { ManagerCustomerComponent } from './manager-customer/manager-customer.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [
    DetailCustomerComponent,
    DetailEmployeeComponent,
    ManagerEmployeeComponent,
    ManagerCustomerComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TooltipModule,
    DialogModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    DropdownModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    RadioButtonModule,
    PasswordModule,
    ConfirmDialogModule,
    InputSwitchModule,
    PanelModule,
    TagModule,
    ToastModule,
    SelectButtonModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class UserModule {}
