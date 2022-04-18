import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartOneComponent } from './chart-one/chart-one.component';
import { ChartTwoComponent } from './chart-two/chart-two.component';

const routes: Routes = [
  { path: 'chart-1', component: ChartOneComponent  },
  { path: 'chart-2', component: ChartTwoComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
