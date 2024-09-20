import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCustomerComponent } from './address-customer.component';

describe('AddressCustomerComponent', () => {
  let component: AddressCustomerComponent;
  let fixture: ComponentFixture<AddressCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
