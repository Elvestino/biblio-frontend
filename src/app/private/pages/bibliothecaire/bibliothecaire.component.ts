import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { QrcodeBibliothecaireComponent } from '../../component/qrcode-bibliothecaire/qrcode-bibliothecaire.component';
import { HttpClientModule } from '@angular/common/http';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import { Bibliothecaire } from '../../model/bibliothecaire.model';
import Swal from 'sweetalert2';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeModule } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';
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
  ],
  templateUrl: './bibliothecaire.component.html',
  styleUrl: './bibliothecaire.component.scss',
})
export class BibliothecaireComponent implements OnInit {
  constructor(
    private bibliothecaireService: BibliothecaireService,
    private formBuilder: FormBuilder
  ) {}
  isBibliothecaireComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = false;
  selectedData: any[] = [];
  bibliothecaires: Bibliothecaire[] = [];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  title = 'Enregistrement';

  selectedBibliothecaire: Bibliothecaire | null = null;
  isEditing = false;
  formHeader = 'Valider';

  //////////////////OPEN AND CLOSE CARD///////////////////////////
  // closeCard() {
  //   this.isBibliothecaireComponentOpen = false;
  // }
  openAddBibliothecaire() {
    this.selectedData = [];
    this.isBibliothecaireComponentOpen = true;
  }
  closeForm() {
    this.qrcodeBibliothecaire = false;
    this.isBibliothecaireComponentOpen = false;
  }
  QrcodeClose() {
    this.qrcodeBibliothecaire = false;
  }
  QrcodeOpen() {
    this.qrcodeBibliothecaire = !this.qrcodeBibliothecaire;
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
  updateBibliothecaire(item: Bibliothecaire) {
    this.selectedBibliothecaire = item;
    this.isBibliothecaireComponentOpen = true;

    const dateNaissance = new Date(item.date_naissance);

    if (!isNaN(dateNaissance.getTime())) {
      this.BibliothecaireForm.patchValue({
        nom_biblio: item.nom_biblio,
        prenom_biblio: item.prenom_biblio,
        date_naissance: dateNaissance.toISOString().split('T')[0],
        lieu_naissance: item.lieu_naissance,
        cin_biblio: item.cin_biblio,
        tel_biblio: item.tel_biblio,
      });

      this.isEditing = true;
    } else {
      console.error(
        "La date de naissance n'est pas valide :",
        item.date_naissance
      );
    }
  }

  ///////////////////////CREATE//////////////////////

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

  createBibliothecaire() {
    this.isSubmitting = true;
    if (this.BibliothecaireForm.valid) {
      console.log('modifier leka');
      //this.updateBibliothecaire();
    } else {
      console.log('Enregister leka');
      const nouvelId = uuidv4();
      const bibliothecaireData = {
        ...this.BibliothecaireForm.value,
        id: nouvelId,
      };
      this.bibliothecaireService
        .createBibliothecaire(bibliothecaireData)
        .subscribe({
          next: (result) => {
            console.log('Données enregistrées :', result);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Bibliothécaire enregistré',
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
              title: "Erreur lors de l'enregistrement du bibliothécaire",
              showConfirmButton: false,
              timer: 1500,
            });
            console.log(
              "Erreur lors de l'enregistrement : ",
              this.BibliothecaireForm.value
            );
            this.isSubmitting = false;
          },
        });
    }
  }
  adminQrLink: string = '';
  private generateQRCode(qrContent: string): void {
    QRCode.toDataURL(qrContent).then((qrLink: string) => {
      this.adminQrLink = qrLink;
    });
  }
}
