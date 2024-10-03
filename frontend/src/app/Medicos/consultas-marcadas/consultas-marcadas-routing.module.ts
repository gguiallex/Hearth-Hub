import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultasMarcadasPage } from './consultas-marcadas.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultasMarcadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultasMarcadasPageRoutingModule {}
