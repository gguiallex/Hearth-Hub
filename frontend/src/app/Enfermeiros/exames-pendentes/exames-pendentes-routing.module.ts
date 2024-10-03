import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamesPendentesPage } from './exames-pendentes.page';

const routes: Routes = [
  {
    path: '',
    component: ExamesPendentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamesPendentesPageRoutingModule {}
