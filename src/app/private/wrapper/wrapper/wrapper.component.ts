import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateNavbarComponent } from '../../component/private-navbar/private-navbar.component';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [RouterOutlet, PrivateNavbarComponent],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent {}
