import { TestBed } from '@angular/core/testing';

import { BibliothecaireService } from '../bibliothecaire.service';

describe('BibliothecaireService', () => {
  let service: BibliothecaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliothecaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
