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
  @Output() openIssuBook = new EventEmitter();
  @Output() openEmpreint = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }

  ohatra() {
    console.log('telecharger');
  }
  test() {
    console.log('lire');
  }
  openIssue(): void {
    // this.issueBook = true;
    this.openIssuBook.emit();
  }
  openEmpreinteComponents(): void {
    this.openEmpreint.emit();
  }
}
