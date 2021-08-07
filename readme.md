# 腾讯云IoT Node-RED 节点

提供了订阅、发布、连接三个节点，在MQTT Broker节点填入三元组（设备ID、设备名称、设备密钥）即可连接腾讯云IoT Explorer，支持多设备发布与订阅


## 连接Node：Tencent IoT MQTT Broker

创建与腾讯云IoT Explorer的连接，对于同一设备的订阅和发布，可以复用同一连接。

#### 节点属性

- productID：产品ID
- deviceName：设备名称
- deviceSecret：设备密钥


## 订阅Node：Tencent IoT Subscribe

通过节点连接腾讯云IOT Explorer，订阅topic，输出下发的内容

使用该节点前，需要先选择一个`MQTT Broker`以建立链接，多个(订阅和发布)节点可共享同一连接

#### 节点属性

- mqtt broker：必须选择一个`MQTT Broker`连接
- topic：订阅主题

#### 输出

输出一个msg对象，包含topic和payload两个属性

- payload：云端下发的内容，类型为json对象
- topic：订阅的主题，类型string

#### 使用flow示例

使用Tencent IoT Subscribe节点，连接debug节点，当收到消息时，输出内容到debug面板和控制台。

![1627895012037](https://img-blog.csdnimg.cn/c78dbd70299b4bdb9abe20a97dd00fdd.png)

```json
[{"id":"d30ad81072911a8e","type":"tab","label":"流程 2","disabled":false,"info":""},{"id":"f29a3084b539a50a","type":"iot-mqtt-subscribe","z":"d30ad81072911a8e","name":"Tencent IoT Subscribe","mqttBroker":"4f3add6f82ac43ce","topic":"$thing/down/property/productID/deviceName","x":440,"y":120,"wires":[["e60fc6eebf814f57"]]},{"id":"e60fc6eebf814f57","type":"debug","z":"d30ad81072911a8e","name":"","active":true,"tosidebar":true,"console":true,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":690,"y":120,"wires":[]},{"id":"4f3add6f82ac43ce","type":"Tencent IoT MQTT Broker","productId":"PANZZ3FT75","deviceName":"dev1","deviceSecret":"deviceSecretx==xxxxxxxxxxxxx"}]
```



## 发布Node：Tencent IoT Publish

通过节点连接腾讯云IOT Explorer，向设备publish内容

使用该节点前，需要先选择一个`MQTT Broker`以建立链接，多个(订阅和发布)节点可共享同一连接

#### 节点属性

- mqtt broker：必须选择一个`MQTT Broker`连接
- topic：publish的主题，优先级小于input

#### 输入

- payload：上报的内容，类型为json对象

- topic：publish的主题，类型string。 可以通过input来传递topic，也可以通过设置public结点的属性来指定topic，**input的中topic的优先级大于节点属性**


例-属性上报，payload需要包含method与params属性

```javascript
msg.topic = $thing/up/property/${productID}/${deviceName}

msg.payload = {
  // 上报为report
  method: "report",
  // 物模型
  params: {
    key1："value1",
    key2："value2"
  }
}
```

#### 输出

输出msg对象，包含topic和payload两个属性

- payload：上报的内容，类型为json对象
- topic：publish的主题，类型string

#### 使用flow示例

使用inject节点传递数据给Tencent IoT Publish节点，然后向云端上报数据，可在腾讯云IoT Explorer看到上报的结果，上报成功后，将结果向后透传

![](https://img-blog.csdnimg.cn/f2127efb51654ab9af19a64152d0026a.png)

```json
[{"id":"b104cbb85796c49d","type":"tab","label":"流程 1","disabled":false,"info":""},{"id":"080dbfa3836fa2c4","type":"iot-mqtt-publish","z":"b104cbb85796c49d","name":"Tencent IoT Publish","mqttBroker":"4f3add6f82ac43ce","topic":"$thing/up/property/prodid/dev1","x":470,"y":520,"wires":[["f8229b6f9976186c"]]},{"id":"f8229b6f9976186c","type":"debug","z":"b104cbb85796c49d","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":740,"y":520,"wires":[]},{"id":"a9ba14d8e4af9ed2","type":"inject","z":"b104cbb85796c49d","name":"传送上报数据","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"{\"method\":\"report\",\"params\":{\"a\":1}}","payloadType":"json","x":190,"y":600,"wires":[["080dbfa3836fa2c4","413d652b216812d4"]]},{"id":"413d652b216812d4","type":"iot-mqtt-publish","z":"b104cbb85796c49d","name":"Tencent IoT Publish","mqttBroker":"2741096fb5a14003","topic":"$thing/up/property/prodid/dev2","x":450,"y":680,"wires":[["30fe439f6feb1f1e"]]},{"id":"30fe439f6feb1f1e","type":"debug","z":"b104cbb85796c49d","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":720,"y":680,"wires":[]},{"id":"4f3add6f82ac43ce","type":"Tencent IoT MQTT Broker","productId":"PANZZ3FT75","deviceName":"dev1","deviceSecret":"WxCCBmkOw0xxxxxxxxx"},{"id":"2741096fb5a14003","type":"Tencent IoT MQTT Broker","productId":"PANZZ3FT75","deviceName":"dev2","deviceSecret":"F4/jzvRc6Jxxxxxxxxxx"}]
```
