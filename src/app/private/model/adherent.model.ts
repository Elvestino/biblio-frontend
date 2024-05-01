export class Adherent {
  id: string;
  nom_Adh: string;
  prenom_Adh: string;
  dt_adhesion: Date;
  adrs_Adh: string;
  tel_Adh: string;
  categorie: string;

  constructor(
    id: string,
    nom_Adh: string,
    prenom_Adh: string,
    dt_adhesion: Date,
    adrs_Adh: string,
    tel_Adh: string,
    categorie: string
  ) {
    this.id = id;
    this.nom_Adh = nom_Adh;
    this.prenom_Adh = prenom_Adh;
    this.dt_adhesion = dt_adhesion;
    this.adrs_Adh = adrs_Adh;
    this.tel_Adh = tel_Adh;
    this.categorie = categorie;
  }
}
