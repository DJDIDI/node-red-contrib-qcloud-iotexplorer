import { Node, NodeAPI } from 'node-red';
import { TBrokerNode } from '../iot-mqtt-broker/iot-mqtt-broker';
import setNodeStatus from '../utils/setNodeStatus';


module.exports = (RED: NodeAPI) => {
  function IotPublishNode(config) {
    RED.nodes.createNode(this, config);
    const node = this as Node;
    const mqttNode = RED.nodes.getNode(config.mqttBroker) as TBrokerNode;

    if (!mqttNode) {
      node.error('请先设定Mqtt Broker，建立与腾讯云IOT的连接!');
      return;
    }

    setNodeStatus(node, mqttNode);

    node.on('input', function (msg) {
      if (!msg.topic && !config.topic) {
        node.error('未指定topic!');
        node.send(msg);
        return;
      }
      let topic;
      if (config.topic) topic = config.topic;
      if (msg.topic) topic = msg.topic;
      mqttNode.client.publish(topic, JSON.stringify(msg.payload), (error) => {
        if (error) {
          console.error(error);
          return;
        }
        msg.topic = topic;
        node.send(msg);
      });
    });
  }

  RED.nodes.registerType('iot-mqtt-publish', IotPublishNode);
};
