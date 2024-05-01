import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import { Bibliothecaire } from '../../model/bibliothecaire.model';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-bibliothecaire',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-bibliothecaire.component.html',
  styleUrl: './add-bibliothecaire.component.scss',
})
export class AddBibliothecaireComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private bibliothecaireService: BibliothecaireService
  ) {}
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  title = 'Enregistrement';
  bibliothecaires: Bibliothecaire[] = [];
  selectedBibliothecaire: Bibliothecaire | null = null;
  isEditing = false;
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

  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  formHeader = 'Valider';
  ngOnInit(): void {
    this.loadBibliothecaires();
  }

  loadBibliothecaires() {
    this.bibliothecaireService.getAllBibliothecaires().subscribe((data) => {
      this.bibliothecaires = data;
    });
  }

  createBibliothecaire() {
    this.isSubmitting = true;
    if (this.BibliothecaireForm.valid) {
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

  updateBibliothecaire() {
    if (this.selectedBibliothecaire && this.BibliothecaireForm.valid) {
      const bibliothecaireId = this.selectedBibliothecaire.id;
      this.bibliothecaireService
        .updateBibliothecaire(bibliothecaireId, this.BibliothecaireForm.value)
        .subscribe(() => {
          this.loadBibliothecaires();
          this.BibliothecaireForm.reset();
          this.selectedBibliothecaire = null;
          this.isEditing = false;
        });
    }
  }
  @Input() bibliothecairedata: any = new EventEmitter();

  selectBibliothecaire(bibliothecaire: Bibliothecaire) {
    this.selectedBibliothecaire = bibliothecaire;
    this.BibliothecaireForm.patchValue({
      nom_biblio: this.bibliothecairedata.nom_biblio,
      prenom_biblio: this.bibliothecairedata.prenom_biblio,
      date_naissance: this.bibliothecairedata.date_naissance,
      lieu_naissance: this.bibliothecairedata.lieu_naissance,
      cin_biblio: this.bibliothecairedata.cin_biblio,
      tel_biblio: this.bibliothecairedata.tel_biblio,
    });
    this.isEditing = true;
  }

  cancelEdit() {
    this.BibliothecaireForm.reset();
    this.selectedBibliothecaire = null;
    this.isEditing = false;
  }
}
