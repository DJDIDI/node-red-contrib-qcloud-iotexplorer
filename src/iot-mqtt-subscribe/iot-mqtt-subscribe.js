"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setNodeStatus_1 = require("../utils/setNodeStatus");
module.exports = (RED) => {
    function IotSubscribeNode(config) {
        // 构造函数中链接mqtt
        RED.nodes.createNode(this, config);
        const node = this;
        const topic = config.topic;
        const mqttNode = RED.nodes.getNode(config.mqttBroker);
        if (!mqttNode) {
            node.error('请先设定Mqtt Broker，建立与腾讯云IOT的连接!');
            return;
        }
        if (!topic) {
            node.error('未指定topic');
            return;
        }
        setNodeStatus_1.default(node, mqttNode);
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
