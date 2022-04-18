import { FirstWebWorkerService } from './../../services/first-web-worker.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-one',
  templateUrl: './chart-one.component.html',
  styleUrls: ['./chart-one.component.css']
})
export class ChartOneComponent implements OnInit {

  constructor(
    private webWorkerService: FirstWebWorkerService
  ) { }

  ngOnInit(): void {

  }
  initSharedWorker(){
    this.webWorkerService.initSharedWorker();
  }
  disConnect(){
    this.webWorkerService.disConnect();
  }
  sendMsg() {
    this.webWorkerService.sendMsg('丟資料給sharedWorker!');
  }
  terminateSharedWorker() {
    this.webWorkerService.terminateSharedWorker();
  }
}
