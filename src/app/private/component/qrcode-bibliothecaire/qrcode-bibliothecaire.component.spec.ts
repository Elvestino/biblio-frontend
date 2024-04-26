import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeBibliothecaireComponent } from './qrcode-bibliothecaire.component';

describe('QrcodeBibliothecaireComponent', () => {
  let component: QrcodeBibliothecaireComponent;
  let fixture: ComponentFixture<QrcodeBibliothecaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrcodeBibliothecaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrcodeBibliothecaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
