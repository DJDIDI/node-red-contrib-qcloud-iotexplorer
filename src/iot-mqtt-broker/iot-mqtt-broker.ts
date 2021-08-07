import * as mqtt from 'mqtt';
import { Node, NodeAPI } from 'node-red';
import onSign from '../utils/onSign';

export interface TBrokerNode extends Node {
  productId: string;
  deviceName: string;
  client: mqtt.MqttClient;
  connect: () => Promise<void>;
}

module.exports = function (RED: NodeAPI) {
  function MqttBroker(config) {
    RED.nodes.createNode(this, config);

    const node = this as TBrokerNode;

    const { productId, deviceName, deviceSecret } = config;
    node.productId = productId;
    node.deviceName = deviceName;
    const { username, password } = onSign(productId, deviceName, deviceSecret);

    const mqttUrl = `mqtt://${productId}.iotcloud.tencentdevices.com`;

    const client = mqtt.connect(mqttUrl, {
      username,
      password,
      reconnectPeriod: 10000
    });

    node.client = client;

    client.on('connect', () => {
      node.log(`已连接至${mqttUrl}`);
    });

    node.on('close', (done) => {
      node.client.end();
      done();
    });
  }

  RED.nodes.registerType('Tencent IoT MQTT Broker', MqttBroker);
};
