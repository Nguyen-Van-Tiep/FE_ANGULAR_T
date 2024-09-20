import { TestBed } from '@angular/core/testing';

import { FileAttachmentService } from './image.service';

describe('FileAttachmentService', () => {
  let service: FileAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
