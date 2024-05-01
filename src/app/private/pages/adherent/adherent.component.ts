import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrcodeAdherentComponent } from '../../component/qrcode-adherent/qrcode-adherent.component';
import { AddAdherentComponent } from '../../component/add-adherent/add-adherent.component';
import { AdherentService } from '../../service/adherent.service';
import Swal from 'sweetalert2';
import { Adherent } from '../../model/adherent.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [
    RouterOutlet,
    QrcodeAdherentComponent,
    AddAdherentComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './adherent.component.html',
  styleUrl: './adherent.component.scss',
})
export class AdherentComponent implements OnInit {
  constructor(private adherentservice: AdherentService) {}
  filter: string[] = ['Tous', 'Eleve', 'Professeur', 'Externe'];
  isAdherentComponentOpen: boolean = false;
  qrcodeadherent: boolean = false;
  selectedData: any[] = [];
  adherent: Adherent[] = [];
  categorieSelectionnee: string = 'Tous';
  closeCard() {
    this.isAdherentComponentOpen = false;
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
  ///////////////////OHTER CODE////////////////////////
  ngOnInit(): void {
    this.loadadherent();
  }
  loadadherent() {
    this.adherentservice.getAlladherents().subscribe((data) => {
      this.adherent = data;
    });
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
  updateadherent(item: any) {
    console.log('donnee rehetra :', item);
    this.selectedData = item;
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
}
