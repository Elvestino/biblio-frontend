import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBibliothecaireComponent } from './add-bibliothecaire.component';

describe('AddBibliothecaireComponent', () => {
  let component: AddBibliothecaireComponent;
  let fixture: ComponentFixture<AddBibliothecaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBibliothecaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBibliothecaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
