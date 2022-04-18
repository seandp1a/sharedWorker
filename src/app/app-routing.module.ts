import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'chart/chart-1', pathMatch: 'full', },
  { path: 'chart', loadChildren: () => import('./chart/chart.module').then((m) => m.ChartModule), },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
