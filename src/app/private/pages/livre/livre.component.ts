import { Component } from '@angular/core';
import { VoirPlusLivreComponent } from '../../component/voir-plus-livre/voir-plus-livre.component';
import { AddLivreComponent } from '../../component/add-livre/add-livre.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-livre',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoirPlusLivreComponent,
    AddLivreComponent,
  ],
  templateUrl: './livre.component.html',
  styleUrl: './livre.component.scss',
})
export class LivreComponent {
  isAddLivre: boolean = false;
  isVoirplus: boolean = false;
  openLivre() {
    this.isAddLivre = true;
  }
  closeCard() {
    this.isAddLivre = false;
  }
  openVoirPLus() {
    this.isVoirplus = true;
  }
  closeVoirPLus() {
    this.isVoirplus = false;
  }
}
