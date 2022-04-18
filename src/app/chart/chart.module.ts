import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartOneComponent } from './chart-one/chart-one.component';
import { ChartTwoComponent } from './chart-two/chart-two.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChartOneComponent,
    ChartTwoComponent
  ],
  imports: [
    CommonModule,
    ChartRoutingModule,
    FormsModule
  ]
})
export class ChartModule { }
