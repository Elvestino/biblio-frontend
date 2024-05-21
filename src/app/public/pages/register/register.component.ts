import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Enregistrement } from '../../../private/model/enregistrement.model';
import Swal from 'sweetalert2';
import { EnregistrementService } from '../../../private/service/enregistrement.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NavbarComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  showPassword: boolean = false;

  VisiblePassword() {
    this.showPassword = !this.showPassword;
  }

  selectedUsers: Enregistrement = {
    nomComplet: '',
    adresse: '',
    email: '',
    id: '',
    contact: '',
    nomUtilisateur: '',
    motDePasse: '',
    ConfirmationmotDePasse: '',
  };

  UsersForm: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private usersService: EnregistrementService,
    private router: Router
  ) {
    // Définition de passwordMatchValidator ici

    this.UsersForm = this.formbuilder.group(
      {
        nomComplet: ['', Validators.required],
        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contact: ['', Validators.required],
        nomUtilisateur: ['', Validators.required],
        motDePasse: ['', [Validators.required, Validators.minLength(6)]],
        ConfirmationmotDePasse: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('motDePasse')?.value ===
      form.get('confirmationMotDePasse')?.value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {}

  get motDePasse() {
    return this.UsersForm.get('motDePasse');
  }
  get email() {
    return this.UsersForm.get('email');
  }
  get ConfirmationmotDePasse() {
    return this.UsersForm.get('ConfirmationmotDePasse');
  }

  // //////////////////CREATE //////////////////////

  createUsers() {
    // Vérification des mots de passe
    if (
      this.UsersForm.value.motDePasse !==
      this.UsersForm.value.ConfirmationmotDePasse
    ) {
      Swal.fire(
        'Erreur',
        'Les mots de passe et la confirmation du mot de passe sont incorrectes.',
        'error'
      );
      return; // Arrête l'exécution de la fonction après avoir affiché l'alerte
    }

    // Vérification de l'email
    const emailControl = this.UsersForm.get('email');
    if (!emailControl || !emailControl.value) {
      Swal.fire('Erreur', "L'adresse email est requise.", 'error');
      return; // Arrête l'exécution de la fonction après avoir affiché l'alerte
    }

    const emailValue = emailControl.value;
    const gmailRegex = /@gmail\.com$/;
    if (!gmailRegex.test(emailValue)) {
      Swal.fire(
        'Erreur',
        "L'adresse email doit se terminer par @gmail.com.",
        'error'
      );
      return; // Arrête l'exécution de la fonction après avoir affiché l'alerte
    } else {
      // Création de l'utilisateur si les vérifications passent
      const UsersData = this.UsersForm.value;
      this.usersService.createUser(UsersData).subscribe({
        next: (result) => {
          console.log('data :', result);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Utilisateur enregistré',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.UsersForm.reset();
            this.router.navigate(['/login']);
          });
        },
        error: () => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Erreur lors de l'enregistrement",
            showConfirmButton: false,
            timer: 1500,
          });
          console.log(
            "Erreur lors de l'enregistrement :",
            this.UsersForm.value
          );
        },
      });
    }
  }
}
