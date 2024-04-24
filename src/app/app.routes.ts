import { Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { guardGuard } from './public/guard/guard.guard';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { RegisterComponent } from './public/pages/register/register.component';
import { LoginComponent } from './public/pages/login/login.component';
import { privateGuardGuard } from './private/guard/private-guard.guard';
import { WrapperComponent } from './private/wrapper/wrapper/wrapper.component';
import { DashboardComponent } from './private/pages/dashboard/dashboard.component';
import { AdherentComponent } from './private/pages/adherent/adherent.component';
import { BibliothecaireComponent } from './private/pages/bibliothecaire/bibliothecaire.component';
import { LivreComponent } from './private/pages/livre/livre.component';
import { ParametreComponent } from './private/pages/parametre/parametre.component';
import { ScannerComponent } from './private/pages/scanner/scanner.component';

export const routes: Routes = [
  // public routes;
  { path: '', component: HomeComponent, canActivate: [guardGuard] },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guardGuard],
  },
  { path: 'register', component: RegisterComponent, canActivate: [guardGuard] },

  // private routes;
  {
    path: 'private',
    component: WrapperComponent,
    canActivate: [privateGuardGuard],
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '', component: DashboardComponent },
      // {
      //   path: 'materiel',
      //   component: MaterielComponent,
      //   children: [
      //     { path: 'facture', component: FactureComponent },
      //     { path: 'entree', component: EntreeComponent },
      //     { path: 'sortie', component: SortieComponent },
      //   ],
      // },
      { path: 'adherent', component: AdherentComponent },
      { path: 'bibliothecaire', component: BibliothecaireComponent },
      { path: 'livre', component: LivreComponent },
      { path: 'scanner', component: ScannerComponent },
      { path: 'parametre', component: ParametreComponent },
    ],
  },
  // shared routes
  { path: '**', component: NotFoundComponent },
];
