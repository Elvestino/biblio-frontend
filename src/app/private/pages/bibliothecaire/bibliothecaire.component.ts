import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { QrcodeBibliothecaireComponent } from '../../component/qrcode-bibliothecaire/qrcode-bibliothecaire.component';
import { HttpClientModule } from '@angular/common/http';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import { Bibliothecaire } from '../../model/bibliothecaire.model';
import Swal from 'sweetalert2';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Subject, takeUntil } from 'rxjs';

import * as XLSX from 'xlsx';
import { isPlatformBrowser, CommonModule } from '@angular/common';
@Component({
  selector: 'app-bibliothecaire',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    QrcodeBibliothecaireComponent,
    HttpClientModule,
    ReactiveFormsModule,
    QRCodeModule,
    CommonModule,
  ],
  templateUrl: './bibliothecaire.component.html',
  styleUrl: './bibliothecaire.component.scss',
})
export class BibliothecaireComponent implements OnInit {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private bibliothecaireService: BibliothecaireService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  isBibliothecaireComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = false;
  selectedData: any[] = [];
  bibliothecaires: Bibliothecaire[] = [];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  isModifAction: boolean = false;
  title = 'Enregistrement';
  // selectedBibliothecaire: any;

  selectedBibliothecaire: Bibliothecaire = {
    nom_biblio: '',
    prenom_biblio: '',
    id: '',
    date_naissance: new Date(),
    lieu_naissance: '',
    cin_biblio: '',
    tel_biblio: '',
  };
  isEditing = false;
  formHeader = 'Valider';
  loading: boolean = true;

  //////////////////OPEN AND CLOSE CARD///////////////////////////
  // closeCard() {
  //   this.isBibliothecaireComponentOpen = false;
  // }
  openAddBibliothecaire() {
    // this.selectedData = [];
    this.isBibliothecaireComponentOpen = true;
  }
  closeForm() {
    this.qrcodeBibliothecaire = false;
    this.isBibliothecaireComponentOpen = false;
    this.isModifAction = false;
    this.BibliothecaireForm.patchValue({
      nom_biblio: '',
      prenom_biblio: '',
      date_naissance: new Date().toISOString().split('T')[0],
      lieu_naissance: '',
      cin_biblio: '',
      tel_biblio: '',
    });
  }
  QrcodeClose() {
    this.qrcodeBibliothecaire = false;
  }

  QrcodeOpen(item: Bibliothecaire) {
    // 👈 Accepte l'objet Bibliothécaire
    if (!item || !item.id) {
      console.error('ID du bibliothécaire manquant pour le QR code.');
      return;
    }

    // 1. Stocke l'objet sélectionné
    this.selectedBibliothecaire = item;

    // 2. Construit la chaîne de données du QR code
    this.qrData = ` Nom: ${item.nom_biblio} \n Prénom: ${item.prenom_biblio} \n CIN: ${item.cin_biblio} \n Contact: ${item.tel_biblio}`;

    // 3. Ouvre la modale
    this.qrcodeBibliothecaire = true;

    // Assurer la détection des changements pour l'affichage du QR
    this.cdr.detectChanges();
  }
  //////////////////////////////QRCODE //////////////////
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
    this.QrcodeClose();
  }

  ///////////////////OHTER CODE////////////////////////
  ngOnInit(): void {
    this.loadBibliothecaires();
  }
  loadBibliothecaires() {
    this.bibliothecaireService.getAllBibliothecaires().subscribe((data) => {
      this.bibliothecaires = data;
    });
  }

  /////////////////////DELETE///////////////////////////
  deleteBibliothecaire(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Voulez-vous vraiment supprimer le bibliothecaire ?',
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
            text: 'Bibliothecaire supprimer avec success',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.bibliothecaireService.deleteBibliothecaire(id).subscribe(() => {
            this.loadBibliothecaires();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Annuler',
            text: 'Suppression du bibliothecaire annuler',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  ////////////////////////////MODIF//////////////////////

  ///////////////////////CREATE//////////////////////

  BibliothecaireForm = this.formBuilder.group({
    nom_biblio: ['', [Validators.required]],
    prenom_biblio: ['', [Validators.required]],
    date_naissance: ['', [Validators.required]],
    lieu_naissance: ['', [Validators.required]],
    cin_biblio: ['', [Validators.required]],
    tel_biblio: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
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
  createbibliothecaire() {
    this.isSubmitting = true;

    if (this.isModifAction == true) {
      // requete send modif

      const updatedbilbiothecaire = {
        ...this.BibliothecaireForm.value,
        id: this.selectedBibliothecaire.id,
      };
      this.bibliothecaireService
        .updateBibliothecaire(
          this.selectedBibliothecaire.id,
          updatedbilbiothecaire
        )
        .subscribe({
          next: (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Bibliothecaire modifier',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.loadBibliothecaires();
              this.BibliothecaireForm.reset();
              this.isSubmitting = false;
              this.isRegisterSuccess = false;
              this.closeForm();
            });
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: "Erreur lors de la modification de l'bilbiothecaire",
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
      if (this.BibliothecaireForm.valid) {
        const bilbiothecaireData = this.BibliothecaireForm.value;

        this.bibliothecaireService
          .createBibliothecaire(bilbiothecaireData)
          .subscribe({
            next: (result) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Adehrent enregistré',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                this.loadBibliothecaires();
                this.BibliothecaireForm.reset();
                this.isSubmitting = false;
                this.isRegisterSuccess = true;
                this.closeForm();
              });
            },
            error: () => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: "Erreur lors de l'enregistrement du bilbiothecaire",
                showConfirmButton: false,
                timer: 1500,
              });
              // console.log(
              //   "Erreur lors de l'enregistrement : ",
              //   this.BibliothecaireForm.value
              // );
              this.isSubmitting = false;
            },
          });
      }
    }
  }

  updatebiBibliothecaire(item: Bibliothecaire) {
    // console.log('Données a modifier :', item);
    this.isModifAction = true;
    const dateAdhesion = new Date(item.date_naissance);
    this.BibliothecaireForm.patchValue({
      nom_biblio: item.nom_biblio,
      prenom_biblio: item.prenom_biblio,
      date_naissance: dateAdhesion.toISOString().split('T')[0],
      cin_biblio: item.cin_biblio,
      lieu_naissance: item.lieu_naissance,
      tel_biblio: item.tel_biblio,
    });

    this.selectedBibliothecaire = item;
    this.isBibliothecaireComponentOpen = true;
  }
  qrData: string = '';

  ////////////////EXCEL EXPORT //////////////////////

  fileName = 'BibliothecaireExcel.xlsx';
  exportexcel() {
    let data = document.getElementById('dataExport');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
}
