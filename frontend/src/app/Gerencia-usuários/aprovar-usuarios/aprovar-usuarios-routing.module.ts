import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprovarUsuariosPage } from './aprovar-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: AprovarUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AprovarUsuariosPageRoutingModule {}
