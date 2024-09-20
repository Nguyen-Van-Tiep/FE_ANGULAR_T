import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileCustomerRoutingModule } from './profile-customer-routing.module';
import { GeneralCustomerComponent } from './general-customer/general-customer.component';
import { SideBarProfileComponent } from './side-bar-profile/side-bar-profile.component';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { AddressCustomerComponent } from './address-customer/address-customer.component';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrderCustomerComponent } from './order-customer/order-customer.component';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { StepsModule } from 'primeng/steps';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    GeneralCustomerComponent,
    SideBarProfileComponent,
    AddressCustomerComponent,
    OrderCustomerComponent,
    DetailOrderComponent,
  ],
  imports: [
    CommonModule,
    ProfileCustomerRoutingModule,
    PanelModule,
    AvatarModule,
    AvatarGroupModule,
    PanelMenuModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    FormsModule,
    KeyFilterModule,
    RadioButtonModule,
    ToastModule,
    TagModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    SelectButtonModule,
    InputSwitchModule,
    InputIconModule,
    IconFieldModule,
    TableModule,
    PasswordModule,
    DividerModule,
    ConfirmPopupModule,
    StepsModule,
    ScrollPanelModule,
    TimelineModule,
    CardModule,
    RatingModule,
    FileUploadModule,
    TooltipModule,
    PaginatorModule,
    TabViewModule,
  ],
  providers: [DatePipe],
})
export class ProfileCustomerModule {}
