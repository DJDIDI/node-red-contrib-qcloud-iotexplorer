"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setNodeStatus(node, mqttNode) {
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
exports.default = setNodeStatus;
