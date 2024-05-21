export class Enregistrement {
  id: string;
  nomComplet: string;
  adresse: string;
  email: string;
  contact: string;
  nomUtilisateur: string;
  motDePasse: string;
  ConfirmationmotDePasse: string;
  constructor(
    id: string,
    nomComplet: string,
    adresse: string,
    email: string,
    contact: string,
    nomUtilisateur: string,
    motDePasse: string,
    ConfirmationmotDePasse: string
  ) {
    this.id = id;
    this.nomComplet = nomComplet;
    this.adresse = adresse;
    this.email = email;
    this.contact = contact;
    this.nomUtilisateur = nomUtilisateur;
    this.motDePasse = motDePasse;
    this.ConfirmationmotDePasse = ConfirmationmotDePasse;
  }
}
