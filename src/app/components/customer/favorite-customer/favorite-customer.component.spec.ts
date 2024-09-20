import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCustomerComponent } from './favorite-customer.component';

describe('FavoriteCustomerComponent', () => {
  let component: FavoriteCustomerComponent;
  let fixture: ComponentFixture<FavoriteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
