import { Component, OnInit } from '@angular/core';
import { VoirPlusLivreComponent } from '../../component/voir-plus-livre/voir-plus-livre.component';
import { AddLivreComponent } from '../../component/add-livre/add-livre.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmprunterComponent } from '../../component/emprunter/emprunter.component';
import { Livre } from '../../model/livre.model';
import { LivreService } from '../../service/livre.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AdherentService } from '../../service/adherent.service';
import { Adherent } from '../../model/adherent.model';
import { EmprunterService } from '../../service/emprunter.service';
import { Emprunter } from '../../model/emprunter.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
@Component({
  selector: 'app-livre',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoirPlusLivreComponent,
    AddLivreComponent,
    EmprunterComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './livre.component.html',
  styleUrl: './livre.component.scss',
})
export class LivreComponent implements OnInit {
  constructor(
    private livreService: LivreService,
    private adherentservice: AdherentService,
    private emprunterservice: EmprunterService,
    private formBuilder: FormBuilder
  ) {}
  isAddLivre: boolean = false;
  isVoirplus: boolean = false;
  synth = window.speechSynthesis ? window.speechSynthesis : null;
  isEmprunterOpen: boolean = false;
  issueBook: boolean = false;
  livres: Livre[] = [];
  isModifAction: boolean = false;
  data: any[] = [];
  isSynthPlaying: boolean = false;
  ///////////////////////OPEN AND CLOSE CARD///////////////
  categorie: string[] = [
    'Fiction',
    'Non-fiction',
    'Romance',
    'Mystère et thriller',
    'Science-fiction',
    'Fantasy',
    'Horreur',
    'Biographie',
    'Histoire',
    'Autobiographie',
    'Poésie',
    'Théâtre',
    'Philosophie',
    'Religion',
    'Science',
    'Informatique',
    'Art',
    'Musique',
    'Cuisine',
    'Voyage',
    'Éducation',
    'Santé et bien-être',
    'Psychologie',
    'Développement personnel',
    'Affaires et finance',
    'Auto-assistance',
    'Humour',
    'Livres pour enfants',
    'Livres pour adolescents',
    'Livres audio',
    'Bandes dessinées et romans graphiques',
    'Essais',
    'Journaux et mémoires',
    'Littérature classique',
    'Littérature contemporaine',
    'Linguistique',
    'Droit',
    'Économie',
    'Environnement et écologie',
    'Famille et relations',
    'Jeux et passe-temps',
    'Politique et gouvernement',
    'Psychologie sociale',
    'Sciences sociales',
    'Sports et loisirs',
    'Technologie',
    'Transport',
    'Vie quotidienne',
    'Autres',
  ];
  title = 'Enregistrement';
  LivreForm = this.formBuilder.group({
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
  search = new FormControl();
  selectedlivre: Livre = {
    id: '',
    titreLivre: '',
    auteurLivre: '',
    categorie: '',
    description: '',
    editionLivre: '',
  };
  isEditing = false;

  allAdherent: Adherent[] = [];
  getAllAdherent() {
    this.adherentservice.getAlladherents().subscribe((getAllAdherent) => {
      this.allAdherent = getAllAdherent;
    });
  }
  openLivre() {
    this.isAddLivre = true;
  }
  closeCard() {
    this.isAddLivre = false;
  }
  openVoirPLus(item: Livre) {
    this.isVoirplus = true;
    this.LivreForm.patchValue({
      titreLivre: item.titreLivre,
      auteurLivre: item.auteurLivre,
      description: item.description,
      categorie: item.categorie,
      editionLivre: item.editionLivre,
    });
    this.selectedlivre = item;
  }
  closeVoirPLus() {
    this.isVoirplus = false;
  }

  openissueBook() {
    this.issueBook = true;
  }
  closeissueBook() {
    this.issueBook = false;
  }
  openEmpreinte() {
    this.isVoirplus = false;
    this.isEmprunterOpen = true;
  }
  closeEmpreinte() {
    this.isEmprunterOpen = false;
  }

  ngOnInit(): void {
    this.loadlivres();
    this.getAllAdherent();
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchterm) => this.livreService.filterlivre(searchterm))
      )
      .subscribe((filteredItems) => {
        this.livres = filteredItems;
      });
  }

  loadlivres() {
    this.livreService.getAlllivres().subscribe((data) => {
      this.livres = data;
    });
  }

  /////////////////////DELETE///////////////////////////
  deletelivre(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Voulez-vous vraiment supprimer le livre ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OUI!!, Supprimer',
        cancelButtonText: 'NON!!, Ne pas Supprimer',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: 'Supprimer',
            text: 'livre supprimer avec success',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.livreService.deletelivre(id).subscribe(() => {
            this.loadlivres();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Annuler',
            text: 'Suppression du livre annuler',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  ////////////////////////////MODIF//////////////////////
  updatelivre(item: Livre) {
    this.isModifAction = true;

    this.LivreForm.patchValue({
      titreLivre: item.titreLivre,
      auteurLivre: item.auteurLivre,
      description: item.description,
      categorie: item.categorie,
      editionLivre: item.editionLivre,
    });

    this.selectedlivre = item;
    this.isAddLivre = true;
  }

  ///////////////////////////CREATE////////////////

  createlivre() {
    this.isSubmitting = true;

    if (this.isModifAction == true) {
      // requete send modif

      const updatedlivre = {
        ...this.LivreForm.value,
        id: this.selectedlivre.id,
      };
      this.livreService
        .updatelivre(this.selectedlivre.id, updatedlivre)
        .subscribe({
          next: (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'livre modifier',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadlivres();
              this.LivreForm.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = false;
              this.closeCard();
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Erreur lors de la modification du livre',
              showConfirmButton: false,
              timer: 1500,
            });
            console.error('Erreur lors de la modification :', err);
            this.isSubmitting = false;
            this.isRegisterSuccess = false;
          },
        });
    } else {
      //  requete send add
      if (this.LivreForm.valid) {
        const livredata = this.LivreForm.value;
        this.livreService.createlivre(livredata).subscribe({
          next: (result) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Livre enregistré',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadlivres();
              this.LivreForm.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = true;
              this.closeCard();
            });
          },
          error: () => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de l'enregistrement du livre",
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
  }

  ///////////////////////////////////////EMPRUNTER/////////////////////

  status: string[] = ['Emprunter', 'Retourner'];
  titleEmprunter = 'Emprunter un livre';

  formHeaderEmprunter = 'Emprunter';
  EmprunterLivre = this.formBuilder.group({
    titreLivre: ['', [Validators.required]],
    nameAdhrent: ['', [Validators.required]],
    joursEmprunt: ['', [Validators.required, Validators.min(1)]],
    status: ['', [Validators.required]],
  });

  selectedEmprunter: Emprunter = {
    titreLivre: '',
    nameAdhrent: '',
    id: '',
    dateEmprunt: new Date(),
    dateRetour: new Date(),
    status: '',
  };
  createEmprunter() {
    this.isSubmitting = true;

    if (this.isModifAction == true) {
      // Requête de modification

      const updatedEmprunter = {
        ...this.EmprunterLivre.value,
        id: this.selectedEmprunter.id,
      };

      this.emprunterservice
        .updateEmprunt(this.selectedEmprunter.id, updatedEmprunter)
        .subscribe({
          next: (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Emprunt Livre modifié',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.getAllAdherent();
              this.EmprunterLivre.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = false;
              this.closeEmpreinte();
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de la modification de l'Emprunter du livre",
              showConfirmButton: false,
              timer: 1500,
            });
            console.error('Erreur lors de la modification :', err);
            this.isSubmitting = false;
            this.isRegisterSuccess = false;
          },
        });
    } else {
      // Requête d'ajout
      if (this.EmprunterLivre.valid) {
        const EmprunterData: any = this.EmprunterLivre.value; // Définir le type de EmprunterData comme any

        const joursEmprunt = Number(EmprunterData.joursEmprunt);

        if (isNaN(joursEmprunt)) {
          console.error("Le nombre de jours d'emprunt n'est pas valide.");
          return;
        }

        const dateEmprunt = new Date();
        const dateRetour = new Date(dateEmprunt);
        dateRetour.setDate(dateEmprunt.getDate() + joursEmprunt);

        EmprunterData.dateEmprunt = dateEmprunt;
        EmprunterData.dateRetour = dateRetour;

        this.emprunterservice.createEmprunt(EmprunterData).subscribe({
          next: (result) => {
            console.log('data emprunter :', result);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Emprunt du livre enregistré',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.EmprunterLivre.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = true;
              this.closeEmpreinte();
            });
          },
          error: () => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de l'enregistrement d'Emprunt du livre",
              showConfirmButton: false,
              timer: 1500,
            });
            console.log(
              "Erreur lors de l'enregistrement : ",
              this.EmprunterLivre.value
            );
            this.isSubmitting = false;
          },
        });
      }
    }
  }

  /////////////////////////////VOIR PLUS//////////////////////////
  // speak(text: string): void {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   this.synth.speak(utterance);
  // }
  selectedBook: any;

  speakText() {
    this.isSynthPlaying = true;
    this.speak(this.selectedlivre.description);
  }
  // cancel(): void {
  //   this.isSynthPlaying = false;
  //   this.synth.cancel();
  // }
  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.synth) {
      this.synth.speak(utterance);
    } else {
      console.error('SpeechSynthesisUtterance is not available.');
    }
  }

  cancel(): void {
    this.isSynthPlaying = false;
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
