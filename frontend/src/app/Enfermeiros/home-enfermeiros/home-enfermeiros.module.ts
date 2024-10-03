import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeEnfermeirosPageRoutingModule } from './home-enfermeiros-routing.module';

import { HomeEnfermeirosPage } from './home-enfermeiros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeEnfermeirosPageRoutingModule
  ],
  declarations: [HomeEnfermeirosPage]
})
export class HomeEnfermeirosPageModule {}
