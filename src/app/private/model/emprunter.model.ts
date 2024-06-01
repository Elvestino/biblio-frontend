import { Adherent } from './adherent.model';
import { Livre } from './livre.model';

export class Emprunter {
  id: string;
  livre: Livre;
  adherent: Adherent;
  dateEmprunt: Date;
  dateRetour: Date;
  status: string;

  constructor(
    id: string,
    livre: Livre,
    adherent: Adherent,
    dateEmprunt: Date,
    joursEmprunt: number,
    status: string
  ) {
    this.id = id;
    this.livre = livre;
    this.adherent = adherent;
    this.dateEmprunt = dateEmprunt;
    this.dateRetour = new Date(dateEmprunt);
    this.dateRetour.setDate(this.dateEmprunt.getDate() + joursEmprunt);

    this.status = status;
  }
}
