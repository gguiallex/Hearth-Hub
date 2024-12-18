import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcarConsultaPageRoutingModule } from './marcar-consulta-routing.module';

import { MarcarConsultaPage } from './marcar-consulta.page';

import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcarConsultaPageRoutingModule,
    FullCalendarModule
  ],
  declarations: [MarcarConsultaPage]
})
export class MarcarConsultaPageModule {}
