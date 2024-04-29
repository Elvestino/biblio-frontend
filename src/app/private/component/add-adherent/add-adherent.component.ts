import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-adherent',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-adherent.component.html',
  styleUrl: './add-adherent.component.scss',
})
export class AddAdherentComponent {
  constructor(private formbuilder: FormBuilder) {}
  title = 'Enregistrement';

  categorie: string[] = ['Eleve', 'Professeur', 'Externe'];
  AdherentForm = this.formbuilder.group({
    nom_Adherent: ['', [Validators.required]],
    prenom_Adherent: ['', [Validators.required]],
    adrs_Adherent: ['', [Validators.required]],
    tel_Adherent: ['', [Validators.required]],
  });
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  get nom_Adherent() {
    return this.AdherentForm.get('nom_Adherent');
  }
  get prenom_Adherent() {
    return this.AdherentForm.get('prenom_Adherent');
  }
  get adrs_Adherent() {
    return this.AdherentForm.get('adrs_Adherent');
  }
  get tel_Adherent() {
    return this.AdherentForm.get('tel_Adherent');
  }
}
