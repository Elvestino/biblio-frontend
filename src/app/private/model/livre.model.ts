export class Livre {
  id: string;
  titreLivre: string;
  auteurLivre: string;
  editionLivre: string;
  description: string;
  categorie: string;
  disponible: boolean;

  constructor(
    id: string,
    titreLivre: string,
    auteurLivre: string,
    editionLivre: string,
    description: string,
    categorie: string,
    disponible: boolean
  ) {
    this.id = id;
    this.titreLivre = titreLivre;
    this.auteurLivre = auteurLivre;
    this.editionLivre = editionLivre;
    this.description = description;
    this.categorie = categorie;
    this.disponible = disponible;
  }
}
