import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdherentLinkComponent } from './adherent-link.component';

describe('AdherentLinkComponent', () => {
  let component: AdherentLinkComponent;
  let fixture: ComponentFixture<AdherentLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdherentLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdherentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
