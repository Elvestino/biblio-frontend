import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import Swal from 'sweetalert2';
import { ScannerImageComponent } from '../../component/scanner-image/scanner-image.component';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../../service/file-upload.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [
    ZXingScannerModule,
    RouterLink,
    ReactiveFormsModule,
    ScannerImageComponent,
    ScannerComponent,
  ],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export class ScannerComponent implements OnInit {
  scannedData: string[] = [];
  item: string[] = [];
  // open camera to scan qr code(

  selectedDevice: MediaDeviceInfo | undefined;
  // handle close button event
  @Output() result = new EventEmitter<string>();
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }

  onScanSuccess(result: string): void {
    this.result.emit(result);
    // console.log(result);
  }

  onScanError(error: Error): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  scannerQrcode: boolean = false;
  scannerImage: boolean = false;

  openScannImage() {
    this.scannerImage = !this.scannerImage;
  }

  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    }
  }

  submitImage(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Image Scanner',
            text: 'Image Scanner avec Success!',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.getScannedData();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Image Scanner',
            text: 'Erreur, veuiller Reessayer!',
          });
        }
      );
    }
  }
  ngOnInit(): void {
    this.getScannedData();
  }

  getScannedData(): void {
    this.fileUploadService
      .getAllScannedData()
      .subscribe((data) => (this.scannedData = data));
  }

  deleteAllScannedData(): void {
    this.fileUploadService.deleteAllScannedData().subscribe(() => {
      this.scannedData = []; // Vide le tableau après la suppression
    });
  }
}
