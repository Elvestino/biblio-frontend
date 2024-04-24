import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdherentLinkComponent } from '../../component/adherent-link/adherent-link.component';

@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [RouterOutlet, AdherentLinkComponent],
  templateUrl: './adherent.component.html',
  styleUrl: './adherent.component.scss',
})
export class AdherentComponent {}
