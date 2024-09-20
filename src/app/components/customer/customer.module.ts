import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { ProfileCustomerComponent } from './profile-customer/profile-customer.component';
import { NavbarCustomerComponent } from './navbar-customer/navbar-customer.component';

import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

import { BadgeModule } from 'primeng/badge';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { RatingModule } from 'primeng/rating';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FooterCustomerComponent } from './footer-customer/footer-customer.component';
import { CustomerComponent } from './customer.component';
import { ProductDetailCustomerComponent } from './product-detail-customer/product-detail-customer.component';
import { ProductCustomerComponent } from './product-customer/product-customer.component';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { PaymentCustomerComponent } from './payment-customer/payment-customer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    ProfileCustomerComponent,
    NavbarCustomerComponent,
    CustomerComponent,
    HomeCustomerComponent,
    FooterCustomerComponent,
    ProductDetailCustomerComponent,
    ProductCustomerComponent,
    CartDetailsComponent,
    // DetailProductCustomerComponent,
    // CartCustomerComponent,
    PaymentCustomerComponent,
    // FavoriteCustomerComponent,
    // ProductCustomerComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    CarouselModule,
    CardModule,
    TabMenuModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    OverlayPanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    TableModule,
    SelectButtonModule,
    FormsModule,
    BadgeModule,
    GalleriaModule,
    ImageModule,
    TagModule,
    DropdownModule,
    TabViewModule,
    ToastModule,
    ScrollPanelModule,
    PanelModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    RatingModule,
    FieldsetModule,
    InputTextareaModule,
    CheckboxModule,
    SliderModule,
    BreadcrumbModule,
    ProgressSpinnerModule,
    DialogModule,
    InputNumberModule,
    FloatLabelModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
})
export class CustomerModule {}
