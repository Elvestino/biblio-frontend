import { Component } from '@angular/core';
import { VoirPlusLivreComponent } from '../../component/voir-plus-livre/voir-plus-livre.component';
import { AddLivreComponent } from '../../component/add-livre/add-livre.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmprunterComponent } from '../../component/emprunter/emprunter.component';

@Component({
  selector: 'app-livre',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoirPlusLivreComponent,
    AddLivreComponent,
    EmprunterComponent,
  ],
  templateUrl: './livre.component.html',
  styleUrl: './livre.component.scss',
})
export class LivreComponent {
  isAddLivre: boolean = false;
  isVoirplus: boolean = false;
  isIssueBook: boolean = false;
  isEmprunterOpen: boolean = false;
  issueBook: boolean = false;
  ///////////////////////OPEN AND CLOSE CARD///////////////
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

  handleIsIssuBookOpen() {
    console.log('book opened');
    this.isIssueBook = true;
  }

  openissueBook() {
    this.issueBook = true;
  }
  closeissueBook() {
    this.issueBook = false;
  }
  openEmpreinte() {
    this.isVoirplus = false;
    this.isEmprunterOpen = true;
  }
  closeEmpreinte() {
    this.isEmprunterOpen = false;
  }
}
