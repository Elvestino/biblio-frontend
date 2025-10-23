import { Adherent } from './adherent.model';
import { Livre } from './livre.model';

export class Emprunter {
  id: string;
  livre: Livre;
  adherent: Adherent;
  dateEmprunt: Date;
  dateRetour: Date;
  status: string;
  quantity: number;

  constructor(
    id: string,
    livre: Livre,
    adherent: Adherent,
    dateEmprunt: Date,
    joursEmprunt: number,
    status: string,
    quantity: number = 1
  ) {
    this.id = id;
    this.livre = livre;
    this.adherent = adherent;
    this.dateEmprunt = dateEmprunt;
    this.dateRetour = new Date(dateEmprunt);
    this.dateRetour.setDate(this.dateEmprunt.getDate() + joursEmprunt);
    this.quantity = quantity;
    this.status = status;
  }
}
