import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AprovarUsuariosPageRoutingModule } from './aprovar-usuarios-routing.module';

import { AprovarUsuariosPage } from './aprovar-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AprovarUsuariosPageRoutingModule
  ],
  declarations: [AprovarUsuariosPage]
})
export class AprovarUsuariosPageModule {}
