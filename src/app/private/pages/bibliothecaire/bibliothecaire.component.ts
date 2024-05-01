import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AddBibliothecaireComponent } from '../../component/add-bibliothecaire/add-bibliothecaire.component';
import { QrcodeBibliothecaireComponent } from '../../component/qrcode-bibliothecaire/qrcode-bibliothecaire.component';
import { HttpClientModule } from '@angular/common/http';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import { Bibliothecaire } from '../../model/bibliothecaire.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bibliothecaire',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AddBibliothecaireComponent,
    QrcodeBibliothecaireComponent,
    HttpClientModule,
  ],
  templateUrl: './bibliothecaire.component.html',
  styleUrl: './bibliothecaire.component.scss',
})
export class BibliothecaireComponent implements OnInit {
  constructor(private bibliothecaireService: BibliothecaireService) {}
  isBibliothecaireComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = false;
  selectedData: any[] = [];
  bibliothecaires: Bibliothecaire[] = [];
  //////////////////OPEN AND CLOSE CARD///////////////////////////
  closeCard() {
    this.isBibliothecaireComponentOpen = false;
  }
  openAddBibliothecaire() {
    this.selectedData = [];
    this.isBibliothecaireComponentOpen = true;
  }
  QrcodeClose() {
    this.qrcodeBibliothecaire = false;
  }
  QrcodeOpen() {
    this.qrcodeBibliothecaire = !this.qrcodeBibliothecaire;
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
  updateBibliothecaire(item: any) {
    console.log('donnee rehetra :', item);
    this.selectedData = item;
    this.isBibliothecaireComponentOpen = true;
  }
}
