import { TestBed } from '@angular/core/testing';

import { EmprunterService } from '../emprunter.service';

describe('EmprunterService', () => {
  let service: EmprunterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprunterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
