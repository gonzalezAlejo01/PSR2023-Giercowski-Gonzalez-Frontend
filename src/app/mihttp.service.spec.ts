import { TestBed } from '@angular/core/testing';

import { MihttpService } from './mihttp.service';

describe('MihttpService', () => {
  let service: MihttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MihttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
