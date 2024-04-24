import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-adherent-link',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './adherent-link.component.html',
  styleUrl: './adherent-link.component.scss',
})
export class AdherentLinkComponent {}
