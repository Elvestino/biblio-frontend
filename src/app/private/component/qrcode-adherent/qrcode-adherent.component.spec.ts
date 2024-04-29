import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeAdherentComponent } from './qrcode-adherent.component';

describe('QrcodeAdherentComponent', () => {
  let component: QrcodeAdherentComponent;
  let fixture: ComponentFixture<QrcodeAdherentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrcodeAdherentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrcodeAdherentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
