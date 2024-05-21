import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrcodeAdherentComponent } from '../../component/qrcode-adherent/qrcode-adherent.component';

import { AdherentService } from '../../service/adherent.service';
import Swal from 'sweetalert2';
import { Adherent } from '../../model/adherent.model';
import { v4 as uuidv4 } from 'uuid';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { catchError } from 'rxjs';

import * as XLSX from 'xlsx';
@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [
    RouterOutlet,
    QrcodeAdherentComponent,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
  ],
  templateUrl: './adherent.component.html',
  styleUrl: './adherent.component.scss',
})
export class AdherentComponent implements OnInit {
  constructor(
    private adherentservice: AdherentService,
    private formbuilder: FormBuilder
  ) {}
  isModifAction: boolean = false;
  filter: string[] = ['Tous', 'Eleve', 'Professeur', 'Externe'];
  isAdherentComponentOpen: boolean = false;
  qrcodeadherent: boolean = false;

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
  closeCard() {
    this.qrcodeadherent = false;
    this.isAdherentComponentOpen = false;
    this.isModifAction = false;

    this.AdherentForm.patchValue({
      nom_Adh: '',
      prenom_Adh: '',
      dt_adhesion: new Date().toISOString().split('T')[0],
      adrs_Adh: '',
      tel_Adh: '',
      categorie: '',
    });
  }
  QrcodeClose() {
    this.qrcodeadherent = false;
  }
  QrcodeOpen() {
    this.qrcodeadherent = true;
  }
  openAdd() {
    this.isAdherentComponentOpen = true;
  }
  title = 'Enregistrement';
  formHeader = 'valider';
  categorie: string[] = ['Eleve', 'Professeur', 'Externe'];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;

  isEditing = false;
  AdherentForm = this.formbuilder.group({
    nom_Adh: ['', [Validators.required]],
    prenom_Adh: ['', [Validators.required]],
    adrs_Adh: ['', [Validators.required]],
    tel_Adh: ['', [Validators.required]],
    dt_adhesion: ['', [Validators.required]],
    categorie: ['', [Validators.required]],
  });
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
  ///////////////////OHTER CODE////////////////////////
  ngOnInit(): void {
    this.loadadherent();
  }
  loadadherent() {
    this.adherentservice.getAlladherents().subscribe((data) => {
      this.adherent = data;
    });
  }
  /////////////////////////////CREATE///////////////////////

  createadherent() {
    this.isSubmitting = true;

    if (this.isModifAction == true) {
      // requete send modif
      const updatedAdherent = {
        ...this.AdherentForm.value,
        id: this.selectedAdherent.id,
      };
      this.adherentservice
        .updateadherent(this.selectedAdherent.id, updatedAdherent)
        .subscribe({
          next: (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Adherent modifier',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadadherent();
              this.AdherentForm.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = false;
              this.closeCard();
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de la modification de l'adherent",
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
      if (this.AdherentForm.valid) {
        // const nouvelId = uuidv4();
        const AdherentData = this.AdherentForm.value;
        this.adherentservice.createadherent(AdherentData).subscribe({
          next: (result) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Adherent enregistré',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadadherent();
              this.AdherentForm.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = true;
              this.closeCard();
            });
          },
          error: () => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de l'enregistrement de l'adherent",
              showConfirmButton: false,
              timer: 1500,
            });
            console.log(
              "Erreur lors de l'enregistrement : ",
              this.AdherentForm.value
            );
            this.isSubmitting = false;
          },
        });
      }
    }
  }

  /////////////////////DELETE///////////////////////////
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
        title: 'Voulez-vous vraiment supprimer le adherent ?',
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
            text: 'adherent supprimer avec success',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.adherentservice.deleteadherent(id).subscribe(() => {
            this.loadadherent();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Annuler',
            text: 'Suppression du adherent annuler',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  ////////////////////////////MODIF//////////////////////
  updateadherent(item: Adherent) {
    this.isModifAction = true;
    const dateAdhesion = new Date(item.dt_adhesion);
    this.AdherentForm.patchValue({
      nom_Adh: item.nom_Adh,
      prenom_Adh: item.prenom_Adh,
      dt_adhesion: dateAdhesion.toISOString().split('T')[0],
      adrs_Adh: item.adrs_Adh,
      tel_Adh: item.tel_Adh,
      categorie: item.categorie,
    });

    this.selectedAdherent = item;
    this.isAdherentComponentOpen = true;
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

  /////////////////////////TOTAL///////////////////////////

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

  //////////////////////////QRCODE //////////////////////
  @ViewChild('content', { static: false }) content: any;
  Qr() {
    const content = this.content.nativeElement;
    html2canvas(content).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const image = canvas.toDataURL('image/png');
      const imgwidth = 190;
      const imgheight = (canvas.height * imgwidth) / canvas.width;
      pdf.addImage(image, 'PNG', 10, 10, imgwidth, imgheight);
      pdf.save('Qrcode_Bibliothecaire.pdf');
    });
    this.closeCard();
  }

  genererDonneesQr(): string {
    if (!this.selectedAdherent || !this.selectedAdherent.id) {
      console.error(
        'Aucun adhérent sélectionné pour la génération du QR code !'
      );
      return ''; // Retourne une chaîne vide si aucune donnée n'est disponible
    }

    this.adherentservice
      .getadherent(this.selectedAdherent.id)
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des données de l adhérent :',
            error
          );
          return [];
        })
      )
      .subscribe((adherentData) => {
        this.selectedAdherent = adherentData;
        this.genererDonneesQrAvecAdherent();
      });
    return '';
  }

  genererDonneesQrAvecAdherent(): void {
    if (!this.selectedAdherent) {
      console.error(
        'Aucun adhérent sélectionné pour la génération du QR code !'
      );
      return;
    }

    const contenuQRCode = `${this.selectedAdherent.nom_Adh} ${this.selectedAdherent.prenom_Adh}\nAdresse: ${this.selectedAdherent.adrs_Adh}\nContact: ${this.selectedAdherent.tel_Adh}\nCategorie: ${this.selectedAdherent.categorie}`;

    // Utilisez le contenuQRCode pour générer le QR code
  }

  ////////////////EXCEL EXPORT //////////////////////

  fileName = 'AdherentExcel.xlsx';
  exportexcel() {
    let data = document.getElementById('dataExport');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
}
