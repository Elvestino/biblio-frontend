import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Adherent } from '../../model/adherent.model';
import { AdherentService } from '../../service/adherent.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-adherent',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-adherent.component.html',
  styleUrl: './add-adherent.component.scss',
})
export class AddAdherentComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder,
    private adherentService: AdherentService
  ) {}
  title = 'Enregistrement';
  formHeader = 'valider';
  categorie: string[] = ['Eleve', 'Professeur', 'Externe'];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;

  adherent: Adherent[] = [];
  selectedAdherent: Adherent | null = null;
  isEditing = false;
  AdherentForm = this.formbuilder.group({
    nom_Adh: ['', [Validators.required]],
    prenom_Adh: ['', [Validators.required]],
    adrs_Adh: ['', [Validators.required]],
    tel_Adh: ['', [Validators.required]],
    dt_adhesion: ['', [Validators.required]],
    categorie: ['', [Validators.required]],
  });
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
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

  ngOnInit(): void {
    this.loadadherent();
  }

  loadadherent() {
    this.adherentService.getAlladherents().subscribe((data) => {
      this.adherent = data;
    });
  }

  createadherent() {
    this.isSubmitting = true;
    if (this.AdherentForm.valid) {
      const nouvelId = uuidv4();
      const AdherentData = {
        ...this.AdherentForm.value,
        id: nouvelId,
      };
      this.adherentService.createadherent(AdherentData).subscribe({
        next: (result) => {
          console.log('Données enregistrées :', result);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Adehrent enregistré',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.loadadherent();
            this.AdherentForm.reset();
            this.isSubmitting = false;
            this.isRegisterSuccess = true;
            this.closeForm();
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

  updateadherent() {
    if (this.selectedAdherent && this.AdherentForm.valid) {
      const AdherentId = this.selectedAdherent.id;
      this.adherentService
        .updateadherent(AdherentId, this.AdherentForm.value)
        .subscribe(() => {
          this.loadadherent();
          this.AdherentForm.reset();
          this.selectedAdherent = null;
          this.isEditing = false;
        });
    }
  }
  @Input() Adherentdata: any = new EventEmitter();

  selectAdherent(Adherent: Adherent) {
    this.selectedAdherent = Adherent;
    this.AdherentForm.patchValue({
      nom_Adh: this.Adherentdata.nom_Adh,
      prenom_Adh: this.Adherentdata.prenom_Adh,
      dt_adhesion: this.Adherentdata.dt_adhesion,
      adrs_Adh: this.Adherentdata.adrs_Adh,
      tel_Adh: this.Adherentdata.tel_Adh,
      categorie: this.Adherentdata.categorie,
    });
    this.isEditing = true;
  }

  cancelEdit() {
    this.AdherentForm.reset();
    this.selectedAdherent = null;
    this.isEditing = false;
  }
}
