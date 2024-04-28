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
    nom_biblio: ['', [Validators.required]],
    prenom_biblio: ['', [Validators.required]],
    date_naissance: ['', [Validators.required]],
    lieu_naissance: ['', [Validators.required]],
    cin_biblio: ['', [Validators.required]],
    tel_biblio: ['', [Validators.required]],
  });
  get nom_biblio() {
    return this.BibliothecaireForm.get('nom_biblio');
  }
  get prenom_biblio() {
    return this.BibliothecaireForm.get('prenom_biblio');
  }
  get cin_biblio() {
    return this.BibliothecaireForm.get('cin_biblio');
  }
  get date_naissance() {
    return this.BibliothecaireForm.get('date_naissance');
  }
  get lieu_naissance() {
    return this.BibliothecaireForm.get('lieu_naissance');
  }
  get tel_biblio() {
    return this.BibliothecaireForm.get('tel_biblio');
  }

  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  modifdata: any[] = [];
  formHeader = 'Valider';
}
