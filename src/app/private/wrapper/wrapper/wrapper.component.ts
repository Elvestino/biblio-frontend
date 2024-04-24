import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateNavbarComponent } from '../../component/private-navbar/private-navbar.component';
import { BiblioComponent } from '../../component/biblio/biblio.component';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [RouterOutlet, PrivateNavbarComponent, BiblioComponent],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent {}
