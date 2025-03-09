import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendverificationPageRoutingModule } from './sendverification-routing.module';

import { SendverificationPage } from './sendverification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendverificationPageRoutingModule
  ],
  declarations: [SendverificationPage]
})
export class SendverificationPageModule {}
