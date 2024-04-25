import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-bibliothecaire',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-bibliothecaire.component.html',
  styleUrl: './add-bibliothecaire.component.scss',
})
export class AddBibliothecaireComponent {
  constructor(private formBuilder: FormBuilder) {}
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  title = 'Enregistrement';
  BibliothecaireForm = this.formBuilder.group({
    nomBibliothecaire: ['', [Validators.required]],
    prenomBibliothecaire: ['', [Validators.required]],
    cin: ['', [Validators.required]],
    telbibliothecaire: ['', [Validators.required]],
  });
  get nomBibliothecaire() {
    return this.BibliothecaireForm.get('nomBibliothecaire');
  }
  get prenomBibliothecaire() {
    return this.BibliothecaireForm.get('prenomBibliothecaire');
  }
  get cin() {
    return this.BibliothecaireForm.get('cin');
  }
  get telbibliothecaire() {
    return this.BibliothecaireForm.get('telbibliothecaire');
  }

  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  modifdata: any[] = [];
  formHeader = 'Valider';
}
