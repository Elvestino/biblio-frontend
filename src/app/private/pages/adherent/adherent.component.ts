import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { QrcodeAdherentComponent } from '../../component/qrcode-adherent/qrcode-adherent.component';
import { CommonModule } from '@angular/common'; // <--- AJOUTÉ POUR NgClass et les directives Angular
import { AdherentService } from '../../service/adherent.service';
import Swal from 'sweetalert2';
import { Adherent } from '../../model/adherent.model';
import {
  getCountries,
  getCountryCallingCode,
  CountryCode,
} from 'libphonenumber-js';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { catchError, of } from 'rxjs';

import * as XLSX from 'xlsx';
interface CountryDialCode {
  isoCode: CountryCode;
  prefix: string;
}
@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [
    RouterOutlet,
    QrcodeAdherentComponent,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    CommonModule, // <--- Correction pour le support de [ngClass]
  ],
  templateUrl: './adherent.component.html',
  styleUrl: './adherent.component.scss',
})
export class AdherentComponent implements OnInit {
  constructor(
    private adherentservice: AdherentService,
    private formbuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  isModifAction: boolean = false;
  filter: string[] = ['Tous', 'Eleve', 'Professeur', 'Externe'];
  isAdherentComponentOpen: boolean = false;
  qrcodeadherent: boolean = false;
  countryDialCodes: CountryDialCode[] = [];
  adherent: Adherent[] = [];

  categorieSelectionnee: string = 'Tous';
  selectedAdherent: Adherent = {
    adrs_Adh: '',
    categorie: '',
    dt_adhesion: new Date(),
    id: '',
    nom_Adh: '',
    prenom_Adh: '',
    tel_Adh: '',
  };
  // --- Chargement des indicatifs téléphoniques ---

  // --- Propriétés d'état du Formulaire ---
  title = 'Enregistrement';
  formHeader = 'valider';
  categorie: string[] = ['Eleve', 'Professeur', 'Externe'];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  isEditing = false;

  // --- Définition du Formulaire Réactif ---
  AdherentForm = this.formbuilder.group({
    nom_Adh: ['', [Validators.required]],
    prenom_Adh: ['', [Validators.required]],
    adrs_Adh: ['', [Validators.required]],
    tel_Adh: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    dt_adhesion: ['', [Validators.required]],
    categorie: ['', [Validators.required]],
  });

  // --- Getters pour les Contrôles de Formulaire (utilisés dans le HTML pour la validation) ---
  get nom_Adh() {
    return this.AdherentForm.get('nom_Adh');
  }
  get prenom_Adh() {
    return this.AdherentForm.get('prenom_Adh');
  }
  get adrs_Adh() {
    return this.AdherentForm.get('adrs_Adh');
  }
  get tel_Adh() {
    return this.AdherentForm.get('tel_Adh');
  }

  ///////////////////LIFECYCLE & CHARGEMENT////////////////////////
  ngOnInit(): void {
    this.loadCountryDialCodes();
    this.loadadherent();
  }
  // Nouvelle méthode pour charger les codes pays
  loadCountryDialCodes(): void {
    const countries = getCountries(); // Obtient la liste des codes ISO ('FR', 'US', etc.)

    this.countryDialCodes = countries
      .map((isoCode: CountryCode) => {
        try {
          const prefix = `+${getCountryCallingCode(isoCode)}`;
          return { isoCode, prefix };
        } catch (e) {
          // Gère les cas où un code pays pourrait ne pas avoir de code d'appel
          return null;
        }
      })
      .filter((item): item is CountryDialCode => item !== null) // Retire les erreurs
      .sort((a, b) => a.prefix.localeCompare(b.prefix)); // Trie par préfixe (+1, +33, etc.)
  }

  loadadherent() {
    this.adherentservice.getAlladherents().subscribe((data) => {
      this.adherent = data;
    });
  }

  ///////////////////GESTION DES MODALES (BOUTONS D'OUVERTURE/FERMETURE)////////////////////////
  closeCard() {
    this.qrcodeadherent = false;
    this.isAdherentComponentOpen = false;
    this.isModifAction = false;
    this.isRegisterSuccess = false; // Réinitialisation de l'état de succès
    this.isSubmitting = false; // S'assurer que l'état de soumission est réinitialisé

    // Réinitialisation du formulaire à son état initial
    this.AdherentForm.reset({
      nom_Adh: '',
      prenom_Adh: '',
      // Initialise la date à aujourd'hui si le champ est vide
      dt_adhesion: new Date().toISOString().split('T')[0],
      adrs_Adh: '',
      tel_Adh: '',
      categorie: 'choix', // Assurez-vous que c'est la valeur de l'option par défaut
    });
  }

  QrcodeClose() {
    this.qrcodeadherent = false;
    // Réinitialise selectedAdherent à un état vide (Bonne pratique)
    this.selectedAdherent = {
      adrs_Adh: '',
      categorie: '',
      dt_adhesion: new Date(),
      id: '',
      nom_Adh: '',
      prenom_Adh: '',
      tel_Adh: '',
    };
  }

  QrcodeOpen(item: Adherent) {
    this.selectedAdherent = item; // Stocke l'adhérent sélectionné
    this.genererDonneesQrAvecAdherent(); // Génère le QR data
    this.qrcodeadherent = true; // Ouvre la modale
  }

  openAdd() {
    this.isModifAction = false;
    this.isAdherentComponentOpen = true; // <--- C'est ICI que ça doit passer à TRUE
    this.AdherentForm.reset({
      dt_adhesion: new Date().toISOString().split('T')[0],
      categorie: 'choix',
    });
  }
  ///////////////////////////CRÉATION/MODIFICATION (BOUTON DE SOUBISSION)///////////////////////

  createadherent() {
    if (this.AdherentForm.invalid) {
      // Optionnel : marquer tous les champs comme touchés pour afficher les erreurs
      this.AdherentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    // Assurer que les valeurs sont traitées même si elles sont nulles/indéfinies
    const formValues = this.AdherentForm.value;

    const adherentToSave: Partial<Adherent> = {
      nom_Adh: formValues.nom_Adh ?? '',
      prenom_Adh: formValues.prenom_Adh ?? '',
      adrs_Adh: formValues.adrs_Adh ?? '',
      tel_Adh: formValues.tel_Adh ?? '',
      dt_adhesion: formValues.dt_adhesion
        ? new Date(formValues.dt_adhesion)
        : new Date(),
      categorie: formValues.categorie ?? '',
    };

    if (this.isModifAction) {
      // Requete SEND MODIF
      const updatedAdherent: Adherent = {
        ...adherentToSave,
        id: this.selectedAdherent.id, // Utilise l'ID stocké pour la modification
      } as Adherent;

      this.adherentservice
        .updateadherent(this.selectedAdherent.id, updatedAdherent)
        .subscribe({
          next: () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Adhérent modifié',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadadherent();
              this.closeCard();
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de la modification de l'adhérent",
              showConfirmButton: false,
              timer: 1500,
            });
            console.error('Erreur lors de la modification :', err);
            this.isSubmitting = false;
          },
        });
    } else {
      // Requete SEND ADD
      this.adherentservice.createadherent(adherentToSave).subscribe({
        next: () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Adhérent enregistré',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.loadadherent();
            this.isRegisterSuccess = true; // Afficher temporairement le succès
            setTimeout(() => this.closeCard(), 500); // Ferme après 0.5s pour montrer le succès
          });
        },
        error: (err) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Erreur lors de l'enregistrement de l'adhérent",
            showConfirmButton: false,
            timer: 1500,
          });
          console.error("Erreur lors de l'enregistrement : ", err);
          this.isSubmitting = false;
        },
      });
    }
  }

  /////////////////////SUPPRESSION (BOUTON TRASH)///////////////////////////
  deleteadherent(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Voulez-vous vraiment supprimer cet adhérent ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OUI!!, Supprimer',
        cancelButtonText: 'NON!!, Ne pas Supprimer',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.adherentservice.deleteadherent(id).subscribe(() => {
            swalWithBootstrapButtons.fire({
              title: 'Supprimer',
              text: 'Adhérent supprimé avec succès',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
            this.loadadherent();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Annuler',
            text: "Suppression de l'adhérent annulée",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  ////////////////////////////MODIFICATION (BOUTON PENCIL)//////////////////////
  updateadherent(item: Adherent) {
    this.isModifAction = true;
    this.isAdherentComponentOpen = true;

    // Assurer que la date est au format 'YYYY-MM-DD' pour le champ input type="date"
    const dateAdhesion = new Date(item.dt_adhesion);
    const formattedDate = dateAdhesion.toISOString().split('T')[0];

    this.AdherentForm.patchValue({
      nom_Adh: item.nom_Adh,
      prenom_Adh: item.prenom_Adh,
      dt_adhesion: formattedDate,
      adrs_Adh: item.adrs_Adh,
      tel_Adh: item.tel_Adh,
      categorie: item.categorie,
    });

    this.selectedAdherent = item;
  }

  ////////////////////////////FILTRER//////////////////////
  filtrerDonnees(): any[] {
    if (this.categorieSelectionnee === 'Tous') {
      return this.adherent;
    } else {
      return this.adherent.filter(
        (item) => item.categorie === this.categorieSelectionnee
      );
    }
  }

  /////////////////////////TOTAL DES CATÉGORIES///////////////////////////
  getTotalEleves(): number {
    return this.adherent.filter((item) => item.categorie === 'Eleve').length;
  }

  getTotalProfesseurs(): number {
    return this.adherent.filter((item) => item.categorie === 'Professeur')
      .length;
  }

  getTotalExternes(): number {
    return this.adherent.filter((item) => item.categorie === 'Externe').length;
  }

  //////////////////////////QRCODE ET EXPORT PDF//////////////////////
  @ViewChild('content', { static: false }) content: any;
  qrData: string = ''; // Conserver le qrData

  Qr() {
    const content = this.content.nativeElement;
    html2canvas(content).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const image = canvas.toDataURL('image/png');
      const imgwidth = 190;
      const imgheight = (canvas.height * imgwidth) / canvas.width;
      pdf.addImage(image, 'PNG', 10, 10, imgwidth, imgheight);
      pdf.save('Qrcode_Adherent.pdf');
    });
    this.closeCard();
  }

  // NOTE: Les méthodes genererDonneesQrAvecAdherent et genererDonneesQr
  // NE SONT PAS appelées correctement dans votre HTML actuel (QrcodeOpen() sans paramètre).
  // Je les conserve, mais il faudrait lier le bouton du tableau pour qu'il appelle:
  // (click)="QrcodeOpen(item)" et ajuster QrcodeOpen(item: Adherent).

  genererDonneesQrAvecAdherent(): void {
    if (!this.selectedAdherent) {
      console.error(
        'Aucun adhérent sélectionné pour la génération du QR code !'
      );
      return;
    }

    this.qrData = `Nom: ${this.selectedAdherent.nom_Adh} \n Prenom: ${this.selectedAdherent.prenom_Adh} \n Adresse: ${this.selectedAdherent.adrs_Adh} \n Contact: ${this.selectedAdherent.tel_Adh} \n Date Adhesion: ${this.selectedAdherent.dt_adhesion} \n Categorie: ${this.selectedAdherent.categorie}`;
    this.cdr.detectChanges(); // Nécessaire si les données changent en arrière-plan
  }

  genererDonneesQr(): void {
    if (!this.selectedAdherent || !this.selectedAdherent.id) {
      console.error(
        'Aucun adhérent sélectionné pour la génération du QR code !'
      );
      return;
    }

    this.adherentservice
      .getadherent(this.selectedAdherent.id)
      .pipe(
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération des données de l'adhérent :",
            error
          );
          return of(null);
        })
      )
      .subscribe((adherentData) => {
        if (adherentData) {
          this.selectedAdherent = adherentData;
          this.genererDonneesQrAvecAdherent();
        }
      });
  }

  ////////////////EXPORT EXCEL //////////////////////
  fileName = 'AdherentExcel.xlsx';
  exportexcel() {
    let data = document.getElementById('dataExport');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
}
