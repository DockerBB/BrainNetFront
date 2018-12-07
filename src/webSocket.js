// let token = JSON.parse(sessionStorage.getItem('user')).token;
import {store} from './store';

var ws = {
  webSocket: null,
  url: 'wss:' + window.g.API_URL + '/webSocket/',
  // url: 'ws:' + process.env.API_ROOT + '/webSocket/',
  token: '',
  setWebSocket: function (token) {
    this.token = token;
    try {
      this.webSocket = new WebSocket(this.url + this.token);
    } catch (e) {
      console.log(e);
      console.log('socket未连接，系统消息不能及时刷新');
      return;
    }
    this.webSocket.onopen = function () {

    };
    this.webSocket.onmessage = function (evt) {
      let receivedData = JSON.parse(evt.data);
      // console.log('receive socket data');
      // console.log(receivedData);
      switch (receivedData.module) {
        case 'openConnection':
          updateSysMesPrimary(receivedData.json);
          break;

        case 'SysMessage':
          updateSysMes(receivedData.json);
          break;

        case 'Notification':

          break;
      }
    };
    this.webSocket.onclose = function () {
      // this.webSocket = new WebSocket(this.url + this.token);
    };
  },
};

function updateSysMes(payload) {
  let sysMsgDataItem;
  let json = JSON.parse(payload);
  sysMsgDataItem = {
    unread: json.status === '未读',
    sysMsgTitle: json.title,
    sysMsgID: json.id,
    type: json.type
  };
  const tmp = store.state.toBePoppedOut.length;
  store.commit('appendTBPO', sysMsgDataItem);
  store.commit('pushFrontSysMsgItem', sysMsgDataItem);
  // console.log('to be popped out: '+store.state.toBePoppedOut.length);
  // console.log(tmp);
  // console.log(store.state.toBePoppedOut.length);
}

function updateSysMesPrimary(payload) {
  let sysMsgData = {moreUnread: 0, sysMsgItems: []};
  // console.log(sysMsgData.sysMsgItems);
  let json = JSON.parse(payload);
  // console.log(json);
  sysMsgData.moreUnread = json.moreUnread;
  for (let i of json.topSixMessage) {
    // console.log(sysMsgData.sysMsgItems);
    sysMsgData.sysMsgItems.push({
      unread: i.status === '未读',
      sysMsgTitle: i.title,
      sysMsgID: i.id
    })
  }
  store.commit('updateSysMsgSimplified', sysMsgData);
  // console.log('topSixMessage更新store.state：');
}

function updateNotification(payload) {
  let ntfData = [];
  let json = JSON.parse(payload);
  store.commit('updateNotificationSimplified', ntfData);
}

export {
  ws
};
