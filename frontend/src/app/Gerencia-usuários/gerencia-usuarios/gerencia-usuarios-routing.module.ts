import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciaUsuariosPage } from './gerencia-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: GerenciaUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciaUsuariosPageRoutingModule {}
