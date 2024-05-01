export class Bibliothecaire {
  id: string;
  nom_biblio: string;
  prenom_biblio: string;
  date_naissance: Date;
  lieu_naissance: string;
  cin_biblio: string;
  tel_biblio: string;

  constructor(
    id: string,
    nom_biblio: string,
    prenom_biblio: string,
    date_naissance: Date,
    lieu_naissance: string,
    cin_biblio: string,
    tel_biblio: string
  ) {
    this.id = id;
    this.nom_biblio = nom_biblio;
    this.prenom_biblio = prenom_biblio;
    this.date_naissance = date_naissance;
    this.lieu_naissance = lieu_naissance;
    this.cin_biblio = cin_biblio;
    this.tel_biblio = tel_biblio;
  }
}
