import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreRetournerComponent } from './livre-retourner.component';

describe('LivreRetournerComponent', () => {
  let component: LivreRetournerComponent;
  let fixture: ComponentFixture<LivreRetournerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreRetournerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivreRetournerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
