import { TestBed } from '@angular/core/testing';

import { HaircutServiceService } from './haircut-service.service';

describe('HaircutServiceService', () => {
  let service: HaircutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HaircutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
