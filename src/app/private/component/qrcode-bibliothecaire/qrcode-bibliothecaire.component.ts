import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BibliothecaireService } from '../../service/bibliothecaire.service';

@Component({
  selector: 'app-qrcode-bibliothecaire',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, QRCodeModule],
  templateUrl: './qrcode-bibliothecaire.component.html',
  styleUrl: './qrcode-bibliothecaire.component.scss',
})
export class QrcodeBibliothecaireComponent {
  constructor(private bibliothecaireService: BibliothecaireService) {}
  bibliothecaires: any[] = [];
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  ////////////////////////////GET ID////////////////////////

  ngOnInit(): void {
    const id = 'example_id'; // Remplacez 'example_id' par l'ID réel que vous souhaitez récupérer
    this.getBibliothecaireById(id);
  }

  getBibliothecaireById(id: string): void {
    this.bibliothecaireService.getBibliothecaireById(id).subscribe((data) => {
      this.bibliothecaires = data;
    });
  }
  //////////////////////////PDF TELECHARGER////////////////////////
  @ViewChild('content', { static: false }) content: any;
  Qr() {
    const content = this.content.nativeElement;
    html2canvas(content).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const image = canvas.toDataURL('image/png');
      const imgwidth = 190;
      const imgheight = (canvas.height * imgwidth) / canvas.width;
      pdf.addImage(image, 'PNG', 10, 10, imgwidth, imgheight);
      pdf.save('Qrcode_Bibliothecaire.pdf');
    });
    this.close.emit();
  }
}
