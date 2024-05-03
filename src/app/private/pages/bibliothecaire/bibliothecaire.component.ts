import {
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
import { v4 as uuidv4 } from 'uuid';
import { QRCodeModule } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
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
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private route: ActivatedRoute,
    private bibliothecaireService: BibliothecaireService,
    private formBuilder: FormBuilder
  ) {}
  isBibliothecaireComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = false;
  // selectedData: any[] = [];
  bibliothecaires: Bibliothecaire[] = [];
  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  isModifAction: boolean = false;
  title = 'Enregistrement';

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

    if (isPlatformBrowser(this.platformId)) {
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((params) => {
          const id = params['id'];
          if (id) {
            this.bibliothecaireService.getBibliothecaire(id).subscribe({
              next: (res) => {
                this.selectedBibliothecaire = res.selectedBibliothecaire;
                this.generateQRCode(
                  `A-${this.selectedBibliothecaire.id.toString()}`
                );
                this.loading = false;
              },
            });
          }
        });
    }
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
  createbibliothecaire() {
    this.isSubmitting = true;
    console.log('Données a modifier :', this.selectedBibliothecaire);
    if (this.isModifAction == true) {
      // requete send modif
      console.log('Données avant modification :', this.selectedBibliothecaire);
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
            console.log('Données modifiées avec succès :', res);
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
        const nouvelId = uuidv4();
        const bilbiothecaireData = {
          ...this.BibliothecaireForm.value,
          id: nouvelId,
        };
        this.bibliothecaireService
          .createBibliothecaire(bilbiothecaireData)
          .subscribe({
            next: (result) => {
              console.log('Données enregistrées :', result);
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
              console.log(
                "Erreur lors de l'enregistrement : ",
                this.BibliothecaireForm.value
              );
              this.isSubmitting = false;
            },
          });
      }
    }
  }

  updatebiBibliothecaire(item: Bibliothecaire) {
    console.log('Données a modifier :', item);
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

  adminQrLink: string = '';
  private generateQRCode(qrContent: string): void {
    QRCode.toDataURL(qrContent).then((qrLink: string) => {
      this.adminQrLink = qrLink;
    });
  }
}
