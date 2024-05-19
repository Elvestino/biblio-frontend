import { TestBed } from '@angular/core/testing';

import { EnregistrementService } from '../enregistrement.service';

describe('EnregistrementService', () => {
  let service: EnregistrementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnregistrementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
