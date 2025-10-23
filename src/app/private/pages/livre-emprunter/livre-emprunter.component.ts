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
  AllEmprunter: Emprunter[] = [];

  constructor(private emprunterservice: EmprunterService) {}

  ngOnInit(): void {
    this.getAllEmprunter();
  }

  getAllEmprunter() {
    this.emprunterservice.getAllEmprunts().subscribe((emprunt) => {
      this.AllEmprunter = emprunt.map((e) => ({
        ...e,
        quantity: e.quantity || 1, // Si la quantité n'existe pas, mettre 1 par défaut
      }));
    });
  }

  retournerLivre(empruntId: number, id: string): void {
    const empruntToReturn = this.AllEmprunter.find(
      (emprunt) => +emprunt.id === empruntId
    );

    if (empruntToReturn) {
      if (empruntToReturn.quantity > 1) {
        // Décrémenter la quantité si > 1
        empruntToReturn.quantity--;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Quantité décrémentée, livre partiellement retourné.',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Supprimer l'emprunt si quantité = 1
        this.emprunterservice.retournerLivre(empruntId).subscribe({
          next: () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Livre retourné avec succès.',
              showConfirmButton: false,
              timer: 1500,
            });
            this.saveLocalStorage(empruntToReturn);
            this.emprunterservice.deleteEmprunt(id).subscribe(() => {
              this.getAllEmprunter();
            });
          },
          error: (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Erreur lors du retour du livre',
              showConfirmButton: false,
              timer: 1500,
            });
            console.error(error);
          },
        });
      }
    }
  }

  saveLocalStorage(value: Emprunter) {
    const existingData = localStorage.getItem('myData');
    let data: Emprunter[] = existingData ? JSON.parse(existingData) : [];
    data.push(value);
    localStorage.setItem('myData', JSON.stringify(data));
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
