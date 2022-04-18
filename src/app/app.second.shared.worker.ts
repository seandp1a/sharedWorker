
/// <reference lib="webworker" />
declare var _: any;
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
);
declare var self: any;
import { generateFibonacci } from './utils/fibonacci';

const connections: MessagePort[] = [];
/*
  假設非同步程式在此處跑
  可以把API拿到的行情資料丟進 postApiValue
  使其將資料打進有連上此sharedWorker的元件中
  成功做到 拿一次資料 分給所有元件

  以上為理想狀態
*/

const postApiValue = (value:any) => {
  connections.forEach((connection) => {
    connection.postMessage({
      action: 'apiGetData',
      response: value
    });

  });
}

self.onconnect = (connectEvent: MessageEvent) => {
  const port = connectEvent.ports[0];

  connections.push(port);
  port.start();

  port.onmessage = (messageEvent) => {
    // throw new Error('Test error from worker');
    console.log(messageEvent);

    const action = messageEvent.data.action;
    if (action === 'generateFibonacci') {
      console.log('worker got message: ', messageEvent);
      // 執行計算 費波那契數
      const response = generateFibonacci(messageEvent.data.param);
      connections.forEach((connection) => {
        connection.postMessage({
          action: action,
          response: response[1]
        })
      });
    }
    else if (action === 'terminate') {
      self.close();
    }

    else if (action === 'disconnect') {
      const index = connections.indexOf(port);
      connections.splice(index, 1);
      connections.forEach((connection) => {
        connection.postMessage({
          action: action,
          response: `1個連線者離開，目前連線數為${connections.length}`
        });
      })
      // 關閉連線
      port.close();
    }
  };
};
