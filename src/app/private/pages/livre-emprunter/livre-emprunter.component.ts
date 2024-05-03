import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LivreService } from '../../service/livre.service';
import { AdherentService } from '../../service/adherent.service';
import { EmprunterService } from '../../service/emprunter.service';
import { Emprunter } from '../../model/emprunter.model';
import { Adherent } from '../../model/adherent.model';
import { Livre } from '../../model/livre.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livre-emprunter',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './livre-emprunter.component.html',
  styleUrl: './livre-emprunter.component.scss',
})
export class LivreEmprunterComponent implements OnInit {
  constructor(
    private livreService: LivreService,
    private adherentservice: AdherentService,
    private emprunterservice: EmprunterService
  ) {}
  ngOnInit(): void {
    this.getAllAdherent();
    this.getAllEmprunter();
    this.getAlllivre();
  }

  allAdherent: Adherent[] = [];
  getAllAdherent() {
    this.adherentservice.getAlladherents().subscribe((getAllAdherent) => {
      this.allAdherent = getAllAdherent;
    });
  }
  alllivre: Livre[] = [];
  getAlllivre() {
    this.livreService.getAlllivres().subscribe((getAlllivre) => {
      this.alllivre = getAlllivre;
    });
  }
  AllEmprunter: Emprunter[] = [];
  getAllEmprunter() {
    this.emprunterservice.getAllemprunters().subscribe((getAllEmprunter) => {
      this.AllEmprunter = getAllEmprunter;
    });
  }

  deleteEmprunter(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Voulez-vous vraiment supprimer l'emprunt ?",
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
            text: "l'emprunt supprimer avec success",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          this.emprunterservice.deleteemprunter(id).subscribe(() => {
            this.getAllEmprunter();
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
}
