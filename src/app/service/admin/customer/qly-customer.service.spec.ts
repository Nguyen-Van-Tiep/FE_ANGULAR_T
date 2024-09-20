import { TestBed } from '@angular/core/testing';

import { QlyCustomerService } from './qly-customer.service';

describe('QlyCustomerService', () => {
  let service: QlyCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QlyCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
