export class Emprunter {
  id: string;
  titreLivre: string;
  nom_Adh: string;
  dateEmprunt: Date;
  dateRetour: Date;
  status: string;

  constructor(
    id: string,
    titreLivre: string,
    nom_Adh: string,
    dateEmprunt: Date,
    joursEmprunt: number,
    status: string
  ) {
    this.id = id;
    this.titreLivre = titreLivre;
    this.nom_Adh = nom_Adh;
    this.dateEmprunt = dateEmprunt;

    this.dateRetour = new Date(dateEmprunt);
    this.dateRetour.setDate(this.dateEmprunt.getDate() + joursEmprunt);

    this.status = status;
  }
}
