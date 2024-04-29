import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-private-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './private-navbar.component.html',
  styleUrl: './private-navbar.component.scss',
})
export class PrivateNavbarComponent {
  constructor(private router: Router) {}

  logOut() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Voulez-vous vraiment vous deconnecter ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OUI!!',

        cancelButtonText: 'NON!!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // localStorage.removeItem('access_token');
          this.router.navigate(['/']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }
}
