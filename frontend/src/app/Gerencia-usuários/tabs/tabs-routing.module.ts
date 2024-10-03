import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'gerencia-usuarios',
        loadChildren: () => import('../gerencia-usuarios/gerencia-usuarios.module').then(m => m.GerenciaUsuariosPageModule)
      },
      {
        path: 'aprovar',
        loadChildren: () => import('../aprovar-usuarios/aprovar-usuarios.module').then(m => m.AprovarUsuariosPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/gerencia-usuarios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
