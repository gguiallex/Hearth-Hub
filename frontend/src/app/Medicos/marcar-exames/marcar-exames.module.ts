import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcarExamesPageRoutingModule } from './marcar-exames-routing.module';

import { MarcarExamesPage } from './marcar-exames.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcarExamesPageRoutingModule
  ],
  declarations: [MarcarExamesPage]
})
export class MarcarExamesPageModule {}
