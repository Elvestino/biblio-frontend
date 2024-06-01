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
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  isModifAction: boolean = false;
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

  selectedlivre: Livre = {
    id: '',
    titreLivre: '',
    auteurLivre: '',
    categorie: '',
    description: '',
    editionLivre: '',
    disponible: true,
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
    this.getAllEmprunter();
    this.getAllAdherent();
  }

  AllEmprunter: Emprunter[] = [];

  donneelivre: any[] = [];
  getAllEmprunter() {
    this.emprunterservice.getAllEmprunts().subscribe(
      (emprunt) => {
        // console.log('Données reçues :', emprunt);
        if (Array.isArray(emprunt)) {
          this.AllEmprunter = emprunt;

          // Remplir le tableau donneelivre ici après avoir reçu les données
          this.donneelivre = this.AllEmprunter.map((e) => e.livre.id);
        } else {
          console.error('Données reçues ne sont pas un tableau :', emprunt);
        }
        console.log('Emprunt après affectation :', this.AllEmprunter);
        // console.log('Données livre après traitement :', this.donneelivre);
      },
      (error) => {
        console.error('Erreur lors de la récupération des Emprunt :', error);
      }
    );
  }

  livres: Livre[] = [];
  loadlivres() {
    this.livreService.getAlllivres().subscribe(
      (data) => {
        // console.log('Données reçues :', data);
        if (Array.isArray(data)) {
          this.livres = data;
        } else {
          console.error('Données reçues ne sont pas un tableau :', data);
        }
        // console.log('Livres après affectation :', this.livres);
      },
      (error) => {
        console.error('Erreur lors de la récupération des livres :', error);
      }
    );
  }

  //////////////////////////CONDITION INDISPONIBLE/////////////
  verification: string = '';
  isButtonDisabled(): boolean {
    const livreId = this.selectedlivre.id;

    // Vérifier si le livre est actuellement emprunté
    const emprunt = this.AllEmprunter.find((item) => item.livre.id === livreId);
    if (emprunt && emprunt.status === 'Emprunté') {
      console.log('Le livre est indisponible');
      this.verification = 'Indisponible';
      return true;
    }

    // Si le livre est retourné, activer le bouton
    if (emprunt && emprunt.status === 'Retourné') {
      console.log('Le livre est disponible');
      this.verification = 'Disponible';
      return false;
    }

    // Le livre n'est pas emprunté
    console.log('Le livre est disponible');
    this.verification = 'Disponible';
    return false;
  }

  ///////////////////////////////////////EMPRUNTER/////////////////////

  titleEmprunter = 'Emprunter un livre';

  formHeaderEmprunter = 'Emprunter';
  EmprunterLivre = this.formBuilder.group({
    titreLivre: ['', [Validators.required]],
    nom_Adh: ['', [Validators.required]],
    joursEmprunt: ['', [Validators.required, Validators.min(1)]],
  });

  selectedEmprunter: Emprunter = {
    livre: {
      id: '',
      titreLivre: '',
      auteurLivre: '',
      editionLivre: '',
      description: '',
      categorie: '',
      disponible: false,
    },
    adherent: {
      id: '',
      nom_Adh: '',
      prenom_Adh: '',
      adrs_Adh: '',
      categorie: '',
      dt_adhesion: new Date(),
      tel_Adh: '',
    },
    id: '',
    dateEmprunt: new Date(),
    dateRetour: new Date(),
    status: '',
  };
  createEmprunter() {
    this.isSubmitting = true;
    if (this.EmprunterLivre.valid) {
      const formValue = this.EmprunterLivre.value;
      const livre = this.livres.find(
        (l) => l.titreLivre === formValue.titreLivre
      );
      const adherent = this.allAdherent.find(
        (a) => a.nom_Adh === formValue.nom_Adh
      );

      if (!livre || !adherent) {
        console.error('Livre ou adhérent non trouvé.');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Livre ou adhérent non trouvé',
          showConfirmButton: false,
          timer: 1500,
        });
        this.isSubmitting = false;
        return;
      }

      const livreId = Number(livre.id);
      const adherentId = Number(adherent.id);
      const joursEmprunt = Number(formValue.joursEmprunt);

      if (isNaN(livreId) || isNaN(adherentId) || isNaN(joursEmprunt)) {
        console.error(
          'Les identifiants et le nombre de jours doivent être des nombres valides.'
        );
        Swal.fire({
          position: 'center',
          icon: 'error',
          title:
            'Les identifiants et le nombre de jours doivent être des nombres valides',
          showConfirmButton: false,
          timer: 1500,
        });
        this.isSubmitting = false;
        return;
      }

      this.emprunterservice
        .emprunterLivre(adherentId, livreId, joursEmprunt)
        .subscribe({
          next: (result) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Emprunt du livre enregistré',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.getAllEmprunter();
              this.loadlivres();
              this.closeEmpreinte();
              this.EmprunterLivre.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = true;
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de l'enregistrement de l'emprunt du livre",
              showConfirmButton: false,
              timer: 1500,
            });
            console.error("Erreur lors de l'enregistrement :", err);
            this.isSubmitting = false;
          },
        });
    } else {
      this.isSubmitting = false;
    }
  }
  retournerLivre(empruntId: number): void {
    this.emprunterservice.retournerLivre(empruntId).subscribe({
      next: (result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Livre retourné avec succès.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          console.log('Livre retourné avec succès.');
          // Rafraîchir la liste des emprunts après avoir retourné le livre
          this.getAllEmprunter();

          // Vérifier si le livre retourné était celui sélectionné
          if (this.selectedlivre && +this.selectedlivre.id === empruntId) {
            // Mettre à jour la disponibilité du livre
            this.updateLivreDisponibilite(true);
          }
        });
      },
      error: (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Erreur lors de la modification du livre',
          showConfirmButton: false,
          timer: 1500,
        });
        console.error('Erreur lors du retour du livre : ', error);
      },
    });
  }

  updateLivreDisponibilite(disponible: boolean): void {
    const livreId = Number(this.selectedlivre.id); // Convertir en nombre
    // Appelez le service Angular pour mettre à jour la disponibilité du livre
    this.emprunterservice
      .updateLivreDisponibilite(livreId, disponible)
      .subscribe(
        () => {
          console.log('Disponibilité du livre mise à jour avec succès.');
        },
        (error) => {
          console.error(
            'Erreur lors de la mise à jour de la disponibilité du livre : ',
            error
          );
        }
      );
  }

  trackByFn(index: number, item: Emprunter) {
    return item.id;
  }

  /////////////////////////////VOIR PLUS//////////////////////////

  selectedBook: any;

  speakText() {
    this.isSynthPlaying = true;
    this.speak(this.selectedlivre.description);
  }

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

  /////////////////////LIVRE ///////////////////////////
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
}
