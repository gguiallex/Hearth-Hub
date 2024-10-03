import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamesPendentesPageRoutingModule } from './exames-pendentes-routing.module';

import { ExamesPendentesPage } from './exames-pendentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamesPendentesPageRoutingModule
  ],
  declarations: [ExamesPendentesPage]
})
export class ExamesPendentesPageModule {}
