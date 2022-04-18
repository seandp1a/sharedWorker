import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirstWebWorkerService {
  sharedWorker: SharedWorker | undefined;
  constructor() {
  }
  public initSharedWorker() {
    if (typeof SharedWorker !== 'undefined') { // 確保瀏覽器支援sharedWorker
      if (this.sharedWorker !== undefined) {
        return;
      }
      this.sharedWorker = new SharedWorker(new URL('../app.shared.worker', import.meta.url));
      console.log('shared worker builded');

      this.sharedWorker.port.onmessage = (messageEvent) => {
        // 從 sharedworker 回來的資料都會在 onmessage 這邊接到
        // 無論當初是透過哪個 action 打資料過去，只要sharedworker 有丟資料回來，這裡都接得到
        // 所以這裡可以透過規範 data 的結構，讓data裡面包含 action 跟 response
        // 再透過 action 決定該如何處裡 response
        const data = messageEvent.data;
        console.log(data);
      };
      this.sharedWorker.port.onmessageerror = (error) => {
        console.error('Error message received from shared worker:', error);
      };
    } else {
      // Shared Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
  public sendMsg(msg: string) {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'sendMsg', param: msg });
  }

  public disConnect() {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'disconnect' });
    this.sharedWorker = undefined;
  }

  public terminateSharedWorker() {
    if (this.sharedWorker === undefined) {
      alert('尚未建立任何sharedWorker連線');
      return;
    };
    this.sharedWorker.port.postMessage({ action: 'terminate' });
  }


}

