import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCustomerComponent } from './general-customer.component';

describe('GeneralCustomerComponent', () => {
  let component: GeneralCustomerComponent;
  let fixture: ComponentFixture<GeneralCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralCustomerComponent]
    });
    fixture = TestBed.createComponent(GeneralCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
