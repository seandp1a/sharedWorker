import { SecondWebWorkerService } from './../../services/second-web-worker.service';
import { Router } from '@angular/router';
import { Component, HostListener, OnDestroy, OnInit, NgZone } from '@angular/core';
@Component({
  selector: 'app-chart-two',
  templateUrl: './chart-two.component.html',
  styleUrls: ['./chart-two.component.css']
})
export class ChartTwoComponent implements OnInit ,OnDestroy{

  constructor(
    private webWorkerService: SecondWebWorkerService,
    private zone : NgZone
  ) { }


  public result: string = '';
  public source: number = 42;
  public time: number = 0;

  ngOnInit(): void {
    this.webWorkerService.latestResult.subscribe((res) => {
      // console.log('behavior Subject有新值',res)
      const startTime = new Date().getMilliseconds();
      this.zone.run(()=>{
        // shared worker 非 angular 原生功能，故這邊要用ngZone，強迫angular在這個值變化後，馬上刷新畫面
        this.result = res.toString();
      })
      const endTime = new Date().getMilliseconds();
      this.time = endTime - startTime;
    });
  }

  ngOnDestroy(): void {
    console.log('disconnect');
    this.webWorkerService.disConnectShared();
  }

  connectShared(){
    this.webWorkerService.initSharedWorker();
  }

  setResult(str:string){
    this.result = str;
  }

  disconnectShared(){
    this.webWorkerService.disConnectShared();
  }

  calcInSharedWorker() {
    this.webWorkerService.calcInSharedWorker(this.source);
  }

  calcAtHere() {
    const startTime = new Date().getMilliseconds();
    this.result = this.generateFibonacci(this.source).toString();
    const endTime = new Date().getMilliseconds();
    this.time = endTime - startTime;
  }


 calcInWebWorker() {
    this.webWorkerService.calcInWebWorker(this.source);
  }
  generateFibonacci(n: number): number {
    return n < 1 ?
      0 : n <= 2 ?
        1 : this.generateFibonacci(n - 1) + this.generateFibonacci(n - 2);
  }


  nextValueToBHS(){
    this.webWorkerService.latestResult.next(123);
  }
}
