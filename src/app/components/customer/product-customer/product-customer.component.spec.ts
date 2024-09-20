import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCustomerComponent } from './product-customer.component';

describe('ProductCustomerComponent', () => {
  let component: ProductCustomerComponent;
  let fixture: ComponentFixture<ProductCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
