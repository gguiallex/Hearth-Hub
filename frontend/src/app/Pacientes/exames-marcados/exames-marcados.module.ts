import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamesMarcadosPageRoutingModule } from './exames-marcados-routing.module';

import { ExamesMarcadosPage } from './exames-marcados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamesMarcadosPageRoutingModule
  ],
  declarations: [ExamesMarcadosPage]
})
export class ExamesMarcadosPageModule {}
