import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-livre',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-livre.component.html',
  styleUrl: './add-livre.component.scss',
})
export class AddLivreComponent {
  constructor(private formBuilder: FormBuilder) {}
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  categorieLivre: string[] = [
    'Fiction',
    'Non-fiction',
    'Science-fiction',
    'Fantasy',
    'Mystère',
    'Horreur',
    'Romance',
    'Biographie',
    'Autobiographie',
    'Essai',
    'Histoire',
    'Thriller',
    'Poésie',
    'Humour',
    'Aventure',
    'Drame',
    'Jeunesse',
    'Classique',
    'Philosophie',
    'Religion',
    'Mathématiques',
    'Physique',
    'Chimie',
    'Biologie',
    'Informatique',
    'Ingénierie',
    'Économie',
    'Histoire',
    'Langues',
    'Littérature',
    'Philosophie',
    'Psychologie',
    'Sociologie',
    'Anthropologie',
    'Art',
    'Musique',
    'Théâtre',
    'Études religieuses',
    'Droit',
    'Médecine',
    'Autre',
  ];
  title = 'Enregistrement';
  LivreForm = this.formBuilder.group({
    image: [''],
    titreLivre: ['', [Validators.required]],
    auteurLivre: ['', [Validators.required]],
    editionLivre: ['', [Validators.required]],
    categorieLivre: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });
  get titreLivre() {
    return this.LivreForm.get('titreLivre');
  }
  get auteurLivre() {
    return this.LivreForm.get('auteurLivre');
  }
  get editionLivre() {
    return this.LivreForm.get('editionLivre');
  }

  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  modifdata: any[] = [];
  formHeader = 'Valider';
}
