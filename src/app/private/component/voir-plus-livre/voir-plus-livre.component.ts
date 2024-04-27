import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-voir-plus-livre',
  standalone: true,
  imports: [],
  templateUrl: './voir-plus-livre.component.html',
  styleUrl: './voir-plus-livre.component.scss',
})
export class VoirPlusLivreComponent {
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
}
