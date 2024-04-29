import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-qrcode-adherent',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './qrcode-adherent.component.html',
  styleUrl: './qrcode-adherent.component.scss',
})
export class QrcodeAdherentComponent {
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
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
