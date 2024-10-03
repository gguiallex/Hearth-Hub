import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamesMarcadosPage } from './exames-marcados.page';

const routes: Routes = [
  {
    path: '',
    component: ExamesMarcadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamesMarcadosPageRoutingModule {}
