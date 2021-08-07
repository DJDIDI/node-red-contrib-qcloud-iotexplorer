import { Node, NodeAPI } from 'node-red';
import { TBrokerNode } from '../iot-mqtt-broker/iot-mqtt-broker';
import setNodeStatus from '../utils/setNodeStatus';

module.exports = (RED: NodeAPI) => {
  function IotSubscribeNode(config) {
    // 构造函数中链接mqtt
    RED.nodes.createNode(this, config);
    const node = this as Node;
    const topic = config.topic;

    const mqttNode = RED.nodes.getNode(config.mqttBroker) as TBrokerNode;
    if (!mqttNode) {
      node.error('请先设定Mqtt Broker，建立与腾讯云IOT的连接!');
      return;
    }
    if (!topic) {
      node.error('未指定topic');
      return;
    }

    setNodeStatus(node, mqttNode);

    mqttNode.client.subscribe(topic, null, (err) => {
      node.log(`订阅主题: ${topic}`);
    });

    mqttNode.client.on('message', (topic, payload) => {
      node.send({
        topic,
        payload: JSON.parse(payload.toString()),
      });
    });
  }

  RED.nodes.registerType('iot-mqtt-subscribe', IotSubscribeNode);
};
