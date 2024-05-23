import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-scanner-image',
  standalone: true,
  imports: [],
  templateUrl: './scanner-image.component.html',
  styleUrl: './scanner-image.component.scss',
})
export class ScannerImageComponent {
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

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
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.http.post('/api/upload', formData).subscribe((response) => {
        console.log(response);
      });
    }
  }
}
