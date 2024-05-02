import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmprunterComponent } from '../emprunter/emprunter.component';
import { LivreService } from '../../service/livre.service';
import { Livre } from '../../model/livre.model';

@Component({
  selector: 'app-voir-plus-livre',
  standalone: true,
  imports: [EmprunterComponent],
  templateUrl: './voir-plus-livre.component.html',
  styleUrl: './voir-plus-livre.component.scss',
})
export class VoirPlusLivreComponent {
  constructor(private livreService: LivreService) {}
  livres: Livre[] = [];
  @Output() close = new EventEmitter();
  @Output() openIssuBook = new EventEmitter();
  @Output() openEmpreint = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }

  openIssue(): void {
    // this.issueBook = true;
    this.openIssuBook.emit();
  }
  openEmpreinteComponents(): void {
    this.openEmpreint.emit();
  }
  // ngOnInit(): void {
  //   this.loadlivres();
  // }

  // loadlivres() {
  //   this.livreService.getlivre(this.livres.id).subscribe((data) => {
  //     this.livres = data;
  //   });
  // }
}
