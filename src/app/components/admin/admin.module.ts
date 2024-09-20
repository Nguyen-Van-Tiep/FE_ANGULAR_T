import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { OrderDetailAdminComponent } from './order-detail-admin/order-detail-admin.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ImageModule } from 'primeng/image';
import { AddProductComponent } from './admin-product/add-product/add-product.component';
import { ManagerProductComponent } from './admin-product/manager-product/manager-product.component';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BrandComponent } from './brand/brand.component';
import { MaterialComponent } from './material/material.component';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { StyleComponent } from './style/style.component';
import { SoleComponent } from './sole/sole.component';
import { ColorPickerModule } from 'primeng/colorpicker';
@NgModule({
  declarations: [
    SidebarAdminComponent,
    NavbarAdminComponent,
    DashboardComponent,
    AdminComponent,
    AdminProductComponent,
    AddProductComponent,
    ManagerProductComponent,
    OrderAdminComponent,
    OrderDetailAdminComponent,
    BrandComponent,
    MaterialComponent,
    ColorComponent,
    SizeComponent,
    StyleComponent,
    SoleComponent
  ],
  imports: [
    CanvasJSAngularChartsModule,
    CommonModule,
    AdminRoutingModule,
    ButtonModule,
    SidebarModule,
    AvatarModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    DialogModule,
    FloatLabelModule,
    InputTextareaModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    OverlayPanelModule,
    PaginatorModule,
    TabViewModule,
    PanelModule,
    ScrollPanelModule,
    TimelineModule,
    CardModule,
    PanelMenuModule,
    ImageModule,
    FileUploadModule,
    InputSwitchModule,
    ColorPickerModule 
  ],
  providers: [DatePipe],
})
export class AdminModule {}
