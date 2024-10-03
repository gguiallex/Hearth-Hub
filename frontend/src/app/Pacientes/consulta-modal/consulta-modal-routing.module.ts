import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaModalPage } from './consulta-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaModalPageRoutingModule {}
