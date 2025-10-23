export class Livre {
  id: string;
  titreLivre: string;
  auteurLivre: string;
  editionLivre: string;
  description: string;
  categorie: string;
  disponible: boolean;
  imageUrl?: string;
  quantity: number;
  [key: string]: any;

  constructor(
    id: string,
    titreLivre: string,
    auteurLivre: string,
    editionLivre: string,
    description: string,
    categorie: string,
    disponible: boolean,
    quantity: number,
    imageUrl?: string
  ) {
    this.id = id;
    this.titreLivre = titreLivre;
    this.auteurLivre = auteurLivre;
    this.editionLivre = editionLivre;
    this.description = description;
    this.categorie = categorie;
    this.quantity = quantity;
    this.disponible = disponible;
    this.imageUrl = imageUrl;
  }
}
