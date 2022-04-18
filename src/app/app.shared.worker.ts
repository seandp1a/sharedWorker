

/// <reference lib="webworker" />
const connections: MessagePort[] = [];
// ＊ 此 sharedWorker 涵蓋所有基本用法&說明 ＊


// self 表 sharedWorker 物件本身，為 sharedWorker 的全域 scope(SharedWorkerGlobalScope);
// 且此行在第二個連線者連上後不會執行，意味著當第一個sharedWorker連線者建立連線後
// 後面的連線者會直接進入下方onconnect
console.log(self);

(self as any).onconnect = (connectEvent: MessageEvent) => {
  // 每一個連進來的元件都會有一個屬於自己的port
  // 下方將 port 理解為連線者
  const port = connectEvent.ports[0];

  // connections(連線池) 存放有哪些 連線者
  connections.push(port);
  // 連線開始
  port.start();

  // console.log('worker got connector!', connectEvent);
  console.log('worker got connector!');
  console.log('number of connectors:', connections);

  // 連線者只要執行"postMessage"，就會在此處的onmessage產生一個messageEvent
  port.onmessage = (messageEvent) => {
    // throw new Error('Test error from worker');

    // postmessage 可以丟 action 跟 param 近來
    // 可以透過 action 決定要對 param 做什麼事情
    const action = messageEvent.data.action;
    const param = messageEvent.data.param;

    if (action === 'sendMsg') {
      const response = param;
      // console.log('worker got message: '+ messageEvent);
      console.log('worker got message: ' + response);
      // 把每個有連上此sharedWorker物件的連線者，都用postMessage的方式丟給他們
      connections.forEach((connection) => {
        connection.postMessage(response);
      });
    }
    else if (action === 'terminate') {
      // 把整個 sharedWorker 服務終止掉
      // 其他連線者會直接無法使用
      // 可以在chorme的網址列輸入 chrome://inspect/#workers 查看當前瀏覽器建立了幾個sharedWorker服務
      self.close();
    }
    else if (action === 'disconnect') {
      // 使元件與 sharedworker 進行 disconnect，sharedWorker服務還在，其他連線者不會被影響
      // disconnect 的元件將無法再透過 postMessage 打資料過來
      // 把 連線者(port) 從 連線池(connections) 中移除
      const index = connections.indexOf(port);
      connections.splice(index, 1);
      console.log(`1個連線者離開，目前連線數為${connections.length}`);

      // 通知連線者們當前 連線池狀況
      connections.forEach((connection) => {
        connection.postMessage(`1個連線者離開，目前連線數為${connections.length}`);
      })
      // 關閉連線
      port.close();
    }

  };

};
