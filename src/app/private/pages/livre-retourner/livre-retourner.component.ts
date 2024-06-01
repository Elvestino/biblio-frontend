import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Emprunter } from '../../model/emprunter.model';

@Component({
  selector: 'app-livre-retourner',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './livre-retourner.component.html',
  styleUrl: './livre-retourner.component.scss',
})
export class LivreRetournerComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {
    this.getData();
    this.calculateTotalDataCount();
  }
  ngOnInit(): void {
    if (typeof window != 'undefined') {
      this.getData();
    }
    this.cdr.detectChanges();
  }

  key: string = 'myData';
  data: Emprunter[] = [];
  getData() {
    const storedData = localStorage.getItem(this.key);
    if (storedData) {
      this.data = JSON.parse(storedData);
    }
  }
  trackByFn(index: number, item: Emprunter): number {
    return Number(item.id);
  }
  removeItemById(id: number) {
    this.data = this.data.filter((item) => +item.id !== id);
    localStorage.setItem(this.key, JSON.stringify(this.data));
    this.cdr.detectChanges();
    this.calculateTotalDataCount();
  }
  calculateTotalDataCount() {
    console.log(this.data.length);

    this.totalDataCount = this.data.length;
  }
  totalDataCount: number = 0;
}
