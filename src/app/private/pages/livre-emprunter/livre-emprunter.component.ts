import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmprunterService } from '../../service/emprunter.service';
import { Emprunter } from '../../model/emprunter.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livre-emprunter',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './livre-emprunter.component.html',
  styleUrl: './livre-emprunter.component.scss',
})
export class LivreEmprunterComponent implements OnInit {
  constructor(private emprunterservice: EmprunterService) {}
  ngOnInit(): void {
    this.getAllEmprunter();
  }
  AllEmprunter: Emprunter[] = [];
  getAllEmprunter() {
    this.emprunterservice.getAllEmprunts().subscribe((emprunt) => {
      this.AllEmprunter = emprunt;
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
          this.emprunterservice.deleteEmprunt(id).subscribe(() => {
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

  retournerLivre(empruntId: number, id: string): void {
    this.emprunterservice.retournerLivre(empruntId).subscribe({
      next: (result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Livre retourné avec succès.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.emprunterservice.deleteEmprunt(id).subscribe(() => {
            this.getAllEmprunter();
          });
          console.log('Livre retourné avec succès.');
          // Rafraîchir la liste des emprunts après avoir retourné le livre
          this.getAllEmprunter();
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
  trackByFn(index: number, item: any): number {
    return item.id; // ou tout autre identifiant unique
  }
}
