export class Enregistrement {
  id: string;
  nomComplet: string;
  adresse: string;
  email: string;
  contact: string;
  nomUtilisateur: string;
  motdepasse: string;
  Confirmationmotdepasse: string;
  constructor(
    id: string,
    nomComplet: string,
    adresse: string,
    email: string,
    contact: string,
    nomUtilisateur: string,
    motdepasse: string,
    Confirmationmotdepasse: string
  ) {
    this.id = id;
    this.nomComplet = nomComplet;
    this.adresse = adresse;
    this.email = email;
    this.contact = contact;
    this.nomUtilisateur = nomUtilisateur;
    this.motdepasse = motdepasse;
    this.Confirmationmotdepasse = Confirmationmotdepasse;
  }
}
