"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require("mqtt");
const onSign_1 = require("../utils/onSign");
module.exports = function (RED) {
    function MqttBroker(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const { productId, deviceName, deviceSecret } = config;
        node.productId = productId;
        node.deviceName = deviceName;
        const { username, password } = onSign_1.default(productId, deviceName, deviceSecret);
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
