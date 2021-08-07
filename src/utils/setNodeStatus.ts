import { Node } from 'node-red';
import { TBrokerNode } from '../iot-mqtt-broker/iot-mqtt-broker';

function setNodeStatus(node: Node, mqttNode: TBrokerNode) {
  const deviceId = `${mqttNode.productId}/${mqttNode.deviceName}`;

  mqttNode.client.on('connect', () => {
    node.status({ fill: 'green', shape: 'dot', text: `connected ${deviceId}` });
  });

  mqttNode.client.on('reconnect', () => {
    node.status({ fill: 'blue', shape: 'dot', text: `reconnect ${deviceId}` });
  });

  mqttNode.client.on('error', (error) => {
    node.status({ fill: 'red', shape: 'dot', text: `error ${deviceId}` });
  });

  mqttNode.client.on('disconnect', () => {
    node.status({ fill: 'grey', shape: 'dot', text: `disconnect ${deviceId}` });
  });

  mqttNode.client.on('end', () => {
    node.status({ fill: 'grey', shape: 'dot', text: `end ${deviceId}` });
  });
}

export default setNodeStatus;
