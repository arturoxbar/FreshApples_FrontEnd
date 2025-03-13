import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SerieDetailPage } from './serie-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SerieDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SerieDetailPageRoutingModule {}
