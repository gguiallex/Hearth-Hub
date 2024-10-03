import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GerenciaUsuariosPageRoutingModule } from './gerencia-usuarios-routing.module';

import { GerenciaUsuariosPage } from './gerencia-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GerenciaUsuariosPageRoutingModule
  ],
  declarations: [GerenciaUsuariosPage]
})
export class GerenciaUsuariosPageModule {}
