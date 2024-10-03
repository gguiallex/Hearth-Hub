import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeEnfermeirosPage } from './home-enfermeiros.page';

const routes: Routes = [
  {
    path: '',
    component: HomeEnfermeirosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeEnfermeirosPageRoutingModule {}
