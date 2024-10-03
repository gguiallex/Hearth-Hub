import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcarExamesPage } from './marcar-exames.page';

const routes: Routes = [
  {
    path: '',
    component: MarcarExamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcarExamesPageRoutingModule {}
