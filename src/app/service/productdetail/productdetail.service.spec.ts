import { TestBed } from '@angular/core/testing';

import { ProductdetailService } from './productdetail.service';

describe('ProductdetailService', () => {
  let service: ProductdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
