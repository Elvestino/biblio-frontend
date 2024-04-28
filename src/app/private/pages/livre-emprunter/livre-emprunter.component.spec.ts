import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreEmprunterComponent } from './livre-emprunter.component';

describe('LivreEmprunterComponent', () => {
  let component: LivreEmprunterComponent;
  let fixture: ComponentFixture<LivreEmprunterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreEmprunterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivreEmprunterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
