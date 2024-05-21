export class Livre {
  id: string;

  titreLivre: string;
  auteurLivre: string;
  editionLivre: string;
  description: string;
  categorie: string;

  constructor(
    id: string,

    titreLivre: string,
    auteurLivre: string,
    editionLivre: string,
    description: string,
    categorie: string
  ) {
    this.id = id;

    this.titreLivre = titreLivre;
    this.auteurLivre = auteurLivre;
    this.editionLivre = editionLivre;
    this.description = description;
    this.categorie = categorie;
  }
}
