import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaModalPageRoutingModule } from './consulta-modal-routing.module';

import { ConsultaModalPage } from './consulta-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaModalPageRoutingModule
  ],
  declarations: [ConsultaModalPage]
})
export class ConsultaModalPageModule {}
