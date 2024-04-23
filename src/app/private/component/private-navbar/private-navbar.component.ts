import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-private-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './private-navbar.component.html',
  styleUrl: './private-navbar.component.scss',
})
export class PrivateNavbarComponent {
  constructor(private router: Router) {}
  logOut() {
    // localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
