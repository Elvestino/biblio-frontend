import { Component, OnInit } from '@angular/core';
import { VoirPlusLivreComponent } from '../../component/voir-plus-livre/voir-plus-livre.component';
import { AddLivreComponent } from '../../component/add-livre/add-livre.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmprunterComponent } from '../../component/emprunter/emprunter.component';
import { Livre } from '../../model/livre.model';
import { LivreService } from '../../service/livre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livre',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoirPlusLivreComponent,
    AddLivreComponent,
    EmprunterComponent,
  ],
  templateUrl: './livre.component.html',
  styleUrl: './livre.component.scss',
})
export class LivreComponent implements OnInit {
  constructor(private livreService: LivreService) {}
  isAddLivre: boolean = false;
  isVoirplus: boolean = true;
  isIssueBook: boolean = false;
  isEmprunterOpen: boolean = false;
  issueBook: boolean = false;
  livres: Livre[] = [];
  data: any[] = [];
  ///////////////////////OPEN AND CLOSE CARD///////////////
  openLivre() {
    this.isAddLivre = true;
  }
  closeCard() {
    this.isAddLivre = false;
  }
  openVoirPLus() {
    this.isVoirplus = true;
  }
  closeVoirPLus() {
    this.isVoirplus = false;
  }

  handleIsIssuBookOpen() {
    console.log('book opened');
    this.isIssueBook = true;
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
  }

  loadlivres() {
    this.livreService.getAlllivres().subscribe((data) => {
      this.livres = data;
    });
  }
  /////////////////////////UPLOAD IMAGE////////////////////
  imageSrc: string | ArrayBuffer | null = null;

  afficherImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = e.target?.result as string | ArrayBuffer | null;
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
  // updateadherent(item: any) {
  //   console.log('donnee rehetra :', item);
  //   this.selectedData = item;
  //   this.isAdherentComponentOpen = true;
  // }
}
