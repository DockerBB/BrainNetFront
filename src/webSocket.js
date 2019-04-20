// let token = JSON.parse(sessionStorage.getItem('user')).token;
/* eslint-disable */
import store from './store';

let ws = {
  webSocket: null,
  url: 'ws:' + window.g.API_URL + '/webSocket/',
  // url: 'ws:' + process.env.API_ROOT + '/webSocket/',
  token: '',
  setWebSocket: function (token) {
    if (this.webSocket != null) return;
    console.log(this.webSocket)
    this.token = token;
    try {
      this.webSocket = new WebSocket(this.url + this.token);
    } catch (e) {
      console.log(e);
      console.log('socket未连接，系统消息不能及时刷新');
      return;
    }
    this.webSocket.onopen = function () {
        console.log('web socket opening...')
        // heartCheck.start()
    };
    this.webSocket.onmessage = function (evt) {
      let receivedData = JSON.parse(evt.data);
      // console.log(receivedData)
      switch (receivedData.module) {
        case 'openConnection':
          updateSysMesPrimary(receivedData.json);
          break;

        case 'SysMessage':
          // updateSysMes(receivedData.json);
          break;

          case 'Notification':

              break;

          case 'gretna':
              store.commit('pushMatlabOutput', receivedData.json);
              break;
          case 'fmri':
              console.log(receivedData.json)
              store.commit('pushfMRIOutput', receivedData.json);
              break;
          case 'gretnaState':
              store.state.netAnalysis.state = receivedData.json
              break;
          case 'fmriState':
              store.state.fmri.state = receivedData.json
              break;
          default:
              console.log(receivedData)
              break;
      }
    };
    const self = this
    let reconnect = function () {
      if(self.webSocket) return;
      console.log('web socket reconnecting...')
      ws.setWebSocket(self.token)
      setTimeout(reconnect,3000)
    }
    this.webSocket.onclose = function (){
      console.log('web socket closed')
      ws.webSocket = null
      setTimeout(reconnect,3000)
    };
    this.webSocket.onerror = function (){
      console.log('web socket error')
      ws.webSocket = null
      setTimeout(reconnect,3000)
    };
    window.onbeforeunload = function () {
      console.log('web socket closed.')
      self.webSocket.close();
    }
  },
};
var heartCheck = {
    timeout: 3000,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function(){
        console.log('start');
        let self = this;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            ws.webSocket.send("heartbeat");
            // self.serverTimeoutObj = setTimeout(function() {
            //     ws.webSocket.close();
            // }, self.timeout);

        }, this.timeout)
    }
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
