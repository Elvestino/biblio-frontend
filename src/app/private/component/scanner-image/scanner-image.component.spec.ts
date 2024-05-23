import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerImageComponent } from './scanner-image.component';

describe('ScannerImageComponent', () => {
  let component: ScannerImageComponent;
  let fixture: ComponentFixture<ScannerImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScannerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
