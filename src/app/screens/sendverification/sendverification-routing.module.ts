import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendverificationPage } from './sendverification.page';

const routes: Routes = [
  {
    path: '',
    component: SendverificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendverificationPageRoutingModule {}
