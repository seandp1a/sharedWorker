import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecondWebWorkerService {
  worker!: Worker;
  sharedWorker: SharedWorker | undefined;
  latestResult: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  sharedResult!: number;
  constructor() {
    this.initWorker();
  }

  /** 初始化 shared worker */
  public initSharedWorker() {
    if (typeof SharedWorker !== 'undefined') { // 確保瀏覽器支援sharedWorker
      // ＊無法將new出來的sharedworker物件存放在 window 中　
      // ＊因為 iframe 與 iframe 之前 OR 分頁與分頁之間 無法共享 window 物件
      // ＊在 chorme 建立連線後於網址列輸入 chrome://inspect/#workers 查看當前所建立的sharedWorker狀況
      if (this.sharedWorker !== undefined) {
        return;
      }
      this.sharedWorker = new SharedWorker(new URL('../app.second.shared.worker', import.meta.url));
      console.log('shared worker builded');



      this.sharedWorker.port.onmessage = (messageEvent) => {

        const action = messageEvent.data.action;
        const message = messageEvent.data.response;

        if (action === 'generateFibonacci') {
          console.log('在 SharedWorker 計算 =>' + message);
          this.latestResult.next(message);

          // this.postMsg(message);
        }

        if (action==='disconnect'){
          console.log(message);
        }

        if (action === 'subscribeResult') {
          console.log('Data received from shared worker subscribeResult', messageEvent);
          this.postMsg(message);
        }

      };
      this.sharedWorker.port.onmessageerror = (error) => {
        console.error('Error message received from shared worker:', error);
      };

      // RXJS 寫法
      // fromEvent<any>(this.sharedWorker.port, 'message').subscribe(({ data }) => {
      //   console.log('rxjs sharedworker got data: ', data);
      // });

    } else {
      // Shared Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  public calcInSharedWorker(number: number = 42) {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'generateFibonacci', param: number });
  }

  public terminateSharedWorker() {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'terminate' });
  }
  public disConnectShared() {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'disconnect' });
    this.sharedWorker = undefined;
  }

  /** 初始化 web worker */
  initWorker() {
    if (typeof Worker !== 'undefined') {
      if (this.worker !== undefined) {
        return;
      };
      // 相對路徑語法
      this.worker = new Worker(new URL('../app.worker', import.meta.url));
      // console.log('worker builded');

      this.worker.onmessage = ({ data }) => {
        // console.log('Data received from worker ', data);
        this.latestResult.next(data);
      };
      this.worker.onerror = (error) => {
        console.error('Error message received from worker:', error);
      };


    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  reg() {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'reg', param: ['1', 'WTX&'] })
  }

  postMsg(msg: any) {
    if (this.worker === undefined) {
      alert('尚未建立任何workerr連線');
      return;
    };
    this.worker.postMessage({ action: 'passValue', param: msg });
  }

  calcInWebWorker(number: number = 42) {
    if (this.worker === undefined) {
      alert('尚未建立任何workerr連線');
      return;
    };
    this.worker.postMessage({ action: 'generateFibonacci', param: number });
  }


  terminateWorker() {
    if (this.worker === undefined) {
      alert('尚未建立任何workerr連線');
      return;
    };
    this.worker.terminate();
  }


}

