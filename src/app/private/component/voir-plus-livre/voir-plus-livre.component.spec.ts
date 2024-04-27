import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirPlusLivreComponent } from './voir-plus-livre.component';

describe('VoirPlusLivreComponent', () => {
  let component: VoirPlusLivreComponent;
  let fixture: ComponentFixture<VoirPlusLivreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirPlusLivreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoirPlusLivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
