import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';
import { EnregistrementService } from '../../../private/service/enregistrement.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPassword: boolean = false;
  PassordVisible() {
    this.showPassword = !this.showPassword;
  }

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private enregistrementService: EnregistrementService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      nomUtilisateur: ['', Validators.required],
      motdepasse: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // postUsers() {
  //   if (this.loginForm.valid) {
  //     const { nomUtilisateur, motdepasse } = this.loginForm.value;

  //     this.enregistrementService
  //       .authenticate(nomUtilisateur, motdepasse)
  //       .subscribe({
  //         next: (user) => {
  //           console.log('data : ', user);
  //           if (user) {
  //             Swal.fire({
  //               position: 'center',
  //               icon: 'success',
  //               title: 'Connexion réussie',
  //               text: 'Vous êtes maintenant connecté.',
  //               showConfirmButton: false,
  //               timer: 1500,
  //             }).then(() => {
  //               this.router.navigate(['/private']);
  //             });
  //           } else {
  //             Swal.fire({
  //               position: 'center',
  //               icon: 'error',
  //               title: 'Erreur de connexion',
  //               text: 'Nom d’utilisateur ou mot de passe incorrect',
  //               showConfirmButton: false,
  //               timer: 1500,
  //             }).then(() => {
  //               this.loginForm.reset();
  //             });
  //           }
  //         },
  //         error: (error) => {
  //           Swal.fire({
  //             position: 'center',
  //             icon: 'error',
  //             title: 'Erreur de connexion',
  //             text:
  //               error.message ||
  //               'Une erreur est survenue lors de la connexion.',
  //             showConfirmButton: true,
  //           });
  //         },
  //       });
  //   }
  // }
}
