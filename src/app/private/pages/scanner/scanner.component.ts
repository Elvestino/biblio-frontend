import { Component } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export class ScannerComponent {
  private codeReader: BrowserMultiFormatReader;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  async scanQRCode() {
    try {
      const videoInputDevices = await this.codeReader.listVideoInputDevices();
      const videoDevice = videoInputDevices[0];
      const constraints = {
        video: {
          deviceId: videoDevice.deviceId
            ? { exact: videoDevice.deviceId }
            : undefined,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      this.codeReader.decodeFromStream(
        stream,
        '',
        (result: { getText: () => any }, error: any) => {
          if (result) {
            console.log('QR Code result:', result.getText());
            // Faites quelque chose avec le résultat du QR code
          }
          if (error) {
            console.error('QR Code scan error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Scanner initialization error:', error);
    }
  }
}
