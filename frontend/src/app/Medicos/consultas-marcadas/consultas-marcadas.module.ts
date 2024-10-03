import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultasMarcadasPageRoutingModule } from './consultas-marcadas-routing.module';

import { ConsultasMarcadasPage } from './consultas-marcadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultasMarcadasPageRoutingModule
  ],
  declarations: [ConsultasMarcadasPage]
})
export class ConsultasMarcadasPageModule {}
