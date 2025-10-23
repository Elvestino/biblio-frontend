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
  data: Emprunter[] = [];

  key: string = 'myData';
  totalDataCount: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const storedData = localStorage.getItem(this.key);
    if (storedData) {
      this.data = JSON.parse(storedData).map((e: any) => ({
        ...e,
        quantity: e.quantity || 1,
      }));
      this.totalDataCount = this.data.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
    }
    this.cdr.detectChanges();
  }

  trackByFn(index: number, item: Emprunter): number {
    return Number(item.id);
  }
}
