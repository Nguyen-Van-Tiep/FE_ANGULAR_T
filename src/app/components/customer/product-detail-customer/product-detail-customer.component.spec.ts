import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCustomerComponent } from './product-detail-customer.component';

describe('ProductDetailCustomerComponent', () => {
  let component: ProductDetailCustomerComponent;
  let fixture: ComponentFixture<ProductDetailCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDetailCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
