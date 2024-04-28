import { Component, EventEmitter, Output } from '@angular/core';
import { EmprunterComponent } from '../emprunter/emprunter.component';

@Component({
  selector: 'app-voir-plus-livre',
  standalone: true,
  imports: [EmprunterComponent],
  templateUrl: './voir-plus-livre.component.html',
  styleUrl: './voir-plus-livre.component.scss',
})
export class VoirPlusLivreComponent {
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  issueBook: boolean = false;

  openissueBook() {
    this.issueBook = true;
  }
  closeissueBook() {
    this.issueBook = false;
  }
}
