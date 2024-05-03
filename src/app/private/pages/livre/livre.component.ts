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
import { v4 as uuidv4 } from 'uuid';
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

  isEmprunterOpen: boolean = false;
  issueBook: boolean = false;
  livres: Livre[] = [];
  isModifAction: boolean = false;
  data: any[] = [];
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
  search = new FormControl();
  selectedlivre: Livre = {
    id: '',
    titreLivre: '',
    auteurLivre: '',
    categorie: '',
    description: '',
    image: '',
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
      image: item.image,
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
  images: any[] = [];
  loadlivres() {
    this.livreService.getAlllivres().subscribe((data) => {
      this.livres = data;
    });
  }
  /////////////////////////UPLOAD IMAGE////////////////////
  imageSrc: string | ArrayBuffer | null = null;

  afficherEtConvertirImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;

      this.imageSrc = base64String;

      if (typeof this.imageSrc === 'string') {
        // L'image est convertie en chaîne de caractères (base64)
        console.log('Image convertie en string :', this.imageSrc);
      } else {
        console.log("L'image n'est pas encore convertie en string.");
      }

      this.LivreForm.patchValue({
        image: base64String,
      });
    };
    reader.readAsDataURL(file);
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
    console.log('Données a modifier :', item);
    this.isModifAction = true;

    this.LivreForm.patchValue({
      titreLivre: item.titreLivre,
      auteurLivre: item.auteurLivre,
      description: item.description,
      categorie: item.categorie,
      editionLivre: item.editionLivre,
      image: item.image,
    });

    this.selectedlivre = item;
    this.isAddLivre = true;
  }

  ///////////////////////////CREATE////////////////

  createlivre() {
    this.isSubmitting = true;
    console.log('Données a modifier :', this.selectedlivre);
    if (this.isModifAction == true) {
      // requete send modif
      console.log('Données avant modification :', this.selectedlivre);
      const updatedlivre = {
        ...this.LivreForm.value,
        id: this.selectedlivre.id,
      };
      this.livreService
        .updatelivre(this.selectedlivre.id, updatedlivre)
        .subscribe({
          next: (res) => {
            console.log('Données modifiées avec succès :', res);
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
        const nouvelId = uuidv4();
        const livredata = {
          ...this.LivreForm.value,
          id: nouvelId,
        };
        this.livreService.createlivre(livredata).subscribe({
          next: (result) => {
            console.log('Données enregistrées :', result);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Adehrent enregistré',
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
              title: "Erreur lors de l'enregistrement de l'livre",
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
  // dateEmprunt: Date = new Date();
  // dateRetour: Date = new Date();
  status: string[] = ['Emprunter', 'Retourner'];
  titleEmprunter = 'Emprunter un livre';

  formHeaderEmprunter = 'Emprunter';
  EmprunterLivre = this.formBuilder.group({
    titreLivre: ['', [Validators.required]],
    nameAdhrent: ['', [Validators.required]],
    dateEmprunt: ['', [Validators.required]],
    dateRetour: ['', [Validators.required]],
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
    console.log('Données a modifier :', this.selectedEmprunter);
    if (this.isModifAction == true) {
      // requete send modif
      console.log('Données avant modification :', this.selectedEmprunter);
      const updatedEmprunter = {
        ...this.EmprunterLivre.value,
        id: this.selectedEmprunter.id,
      };
      this.emprunterservice
        .updateemprunter(this.selectedEmprunter.id, updatedEmprunter)
        .subscribe({
          next: (res) => {
            console.log('Données modifiées avec succès :', res);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Emprunt Livre modifier',
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
      //  requete send add
      if (this.EmprunterLivre.valid) {
        const nouvelId = uuidv4();
        const EmprunterData = {
          ...this.EmprunterLivre.value,
          id: nouvelId,
        };
        this.emprunterservice.createemprunter(EmprunterData).subscribe({
          next: (result) => {
            console.log('Données enregistrées :', result);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Emprunt du livre enregistré',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // this.loadBibliothecaires();
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

  /////////////////////////////RECHERCHE//////////////////////////
}
