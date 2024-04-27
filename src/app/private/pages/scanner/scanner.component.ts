import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ZXingScannerModule, RouterLink, ReactiveFormsModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export class ScannerComponent {
  // open camera to scan qr code(

  selectedDevice: MediaDeviceInfo | undefined;
  // handle close button event
  @Output() result = new EventEmitter<string>();
  @Output() close = new EventEmitter();
  test() {
    this.close.emit();
  }
  onScanSuccess(result: string): void {
    this.result.emit(result);
  }

  onScanError(error: Error): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
