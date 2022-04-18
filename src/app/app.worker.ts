/// <reference lib="webworker" />
declare var _: any;
import { generateFibonacci } from './utils/fibonacci';

importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
);
// console.log(_);
addEventListener('message', (evt) => {
  console.log('worker got message: ', evt.data);
  const action = evt.data.action;
  if (action === 'generateFibonacci') {
    // 執行計算 費波那契數
    const response = generateFibonacci(evt.data.param);
    console.log(response);

    postMessage(response[1]);
  }
  if (action === 'passValue') {
    postMessage(evt.data.param);
  }
  // throw new Error('Test error from worker');
});


