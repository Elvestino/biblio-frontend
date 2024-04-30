import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-emprunter',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './emprunter.component.html',
  styleUrl: './emprunter.component.scss',
})
export class EmprunterComponent {
  constructor(private formBuilder: FormBuilder) {}
  @Output() close = new EventEmitter();
  closeForm(): void {
    this.close.emit();
  }
  status: string[] = ['Emprunter', 'Retourner'];
  title = 'Emprunter un livre';

  isSubmitting: boolean = false;
  isRegisterSuccess: boolean = false;
  modifdata: any[] = [];
  formHeader = 'Emprunter';
  EmprunterLivre = this.formBuilder.group({
    titreLivre: ['', [Validators.required]],
    nameAdhrent: ['', [Validators.required]],
    dateEmprunt: ['', [Validators.required]],
    dateRetour: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });
}
