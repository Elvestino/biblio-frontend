export class Livre {
  id: string;
  image: string;
  titreLivre: string;
  auteurLivre: string;
  editionLivre: string;
  description: string;
  categorie: string;

  constructor(
    id: string,
    image: string,
    titreLivre: string,
    auteurLivre: string,
    editionLivre: string,
    description: string,
    categorie: string
  ) {
    this.id = id;
    this.image = image;
    this.titreLivre = titreLivre;
    this.auteurLivre = auteurLivre;
    this.editionLivre = editionLivre;
    this.description = description;
    this.categorie = categorie;
  }
}
