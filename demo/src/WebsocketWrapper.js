import _ from "lodash";

class WebSocketWrapper {
  constructor(trigger) {
    this.socket = new window.WebSocket('wss://fstream.binance.com/ws/btcusdt@markPrice');
    this.socket.onopen = this.handleOpenSocket;
    this.socket.onmessage = this.handleMessageSocket;
    this.trigger = trigger;
  }

  close() {
    this.socket.close();
    console.log("Disconnected the socket");
  }

  handleOpenSocket = () => {
    console.log("Connected to Socket");
    this.socket.send('{ "method": "SUBSCRIBE", "params": [ "btcusdt@markPrice", "btcusdt@depth" ], "id": 1 }');
  }
  handleMessageSocket = (event) => {
    try {
      const eventData = JSON.parse(event.data);
      if (eventData.p) {
        this.trigger(eventData);
      }
    } catch (error) {
      console.error("Cannot produce data");
    }
  }
}


export default WebSocketWrapper;