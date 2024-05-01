import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { LivreService } from '../../service/livre.service';
import { Livre } from '../../model/livre.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-livre',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-livre.component.html',
  styleUrl: './add-livre.component.scss',
})
export class AddLivreComponent {
  constructor(
    private formBuilder: FormBuilder,
    private livreService: LivreService
  ) {}
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  categorie: string[] = [
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
    image: ['', [Validators.required]],
    titreLivre: ['', [Validators.required]],
    auteurLivre: ['', [Validators.required]],
    editionLivre: ['', [Validators.required]],
    categorie: ['', [Validators.required]],
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
  livres: Livre[] = [];
  selectedlivre: Livre | null = null;
  isEditing = false;

  ////////////////////////AFFICHAGE IMAGE//////////////
  imageSrc: string | ArrayBuffer | null = null;

  afficherImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = e.target?.result as string | ArrayBuffer | null;
    };
    reader.readAsDataURL(file);
  }

  ///////////////////////CRUD//////////////////////////
  ngOnInit(): void {
    this.loadlivres();
  }

  loadlivres() {
    this.livreService.getAlllivres().subscribe((data) => {
      this.livres = data;
    });
  }

  createlivre() {
    this.isSubmitting = true;

    if (this.LivreForm.valid) {
      const nouvelId = uuidv4();
      const livreData = {
        ...this.LivreForm.value,
        id: nouvelId,
      };
      this.livreService.createlivre(livreData).subscribe({
        next: (result) => {
          console.log('Données enregistrées :', result);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bibliothécaire enregistré',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.loadlivres();
            this.LivreForm.reset();
            this.isSubmitting = false;
            this.isRegisterSuccess = true;
            this.closeForm();
          });
        },
        error: () => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Erreur lors de l'enregistrement du bibliothécaire",
            showConfirmButton: false,
            timer: 1500,
          });
          console.log(
            "Erreur lors de l'enregistrement : ",
            this.LivreForm.value
          );
          this.isSubmitting = false;
        },
      });
    }
  }

  updatelivre() {
    if (this.selectedlivre && this.LivreForm.valid) {
      const livreId = this.selectedlivre.id;
      this.livreService
        .updatelivre(livreId, this.LivreForm.value)
        .subscribe(() => {
          this.loadlivres();
          this.LivreForm.reset();
          this.selectedlivre = null;
          this.isEditing = false;
        });
    }
  }
  @Input() livredata: any = new EventEmitter();

  selectlivre(livre: Livre) {
    this.selectedlivre = livre;
    this.LivreForm.patchValue({
      image: this.livredata.image,
      titreLivre: this.livredata.titreLivre,
      auteurLivre: this.livredata.auteurLivre,
      editionLivre: this.livredata.editionLivre,
      description: this.livredata.description,
      categorie: this.livredata.categorie,
    });
    this.isEditing = true;
  }

  cancelEdit() {
    this.LivreForm.reset();
    this.selectedlivre = null;
    this.isEditing = false;
  }
}
