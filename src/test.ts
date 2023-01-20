"use strict";
import { connect, IClientOptions, MqttClient } from "mqtt";
import nodeConfig from "config";
// import setLogger from "./logger";
import { isStatusMessage } from "./typeguards/isStatusMessage";
import { EventEmitter } from 'node:events';
import setLogger from "./logger";

const logger = setLogger();
function connectMQTT() {
    const mqttOptions: IClientOptions = {
        clientId: `roobuck_test_Kiosk`,
        username: nodeConfig.get("mqttUser"),
        password: nodeConfig.get("mqttPass")
    }
    // console.log(mqttOptions);
    const logger = setLogger();
    const mqttBroker = "mqtt://192.168.1.105";
    // console.log(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
    logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
    const mqttClient = connect(mqttBroker, mqttOptions);
    return mqttClient;
}
function addNewSN(mqttClient: MqttClient) {
    mqttClient.subscribe(
        "cr4c7525bc785c/device/status"
    )
}
function addNewSN_1(mqttClient: MqttClient) {

    mqttClient.subscribe(
        "cr4c7525bc7398/device/status"
    )
}
function listenToMqtt(mqttClient: MqttClient) {
    mqttClient.on("message", (topic, payload) => {
        // logger.debug("payload: " + payload.toString());

        console.log("topic: " + topic.toString());
        if (topic.split(/\/(.*)/s)[1] === "device/status") {
            console.log(topic.split(/\/(.*)/s)[0]);
            // try {
            //     const msg = JSON.parse(payload.toString());
            //     if (isStatusMessage(msg)) {
            //         if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
            //             // Do Something
            //             // Confirm Fuel Gauge is operating
            //             // console.log("FUEL VALUE START");
            //             // console.log(msg.fuelRaw.toString());
            //             // console.log("FUEL VALUE END");

            //             console.log(msg);
            //         } else {
            //             // console.log("FUEL VALUE START");
            //             // console.log(msg.fuelRaw.toString());
            //             // console.log("FUEL VALUE END");
            //             // fuelOk = false;
            //         }
            //     } else {
            //         // console.log("failed");
            //         // Fail Condition
            //     }
            // } catch (err) {
            //     if (err instanceof Error) {
            //         // console.log("Error:" + err);
            //     }
            // }
        }
    });
}
const mqttClient = connectMQTT();
addNewSN(mqttClient);
addNewSN_1(mqttClient);
listenToMqtt(mqttClient);
// /**
//  *
//  * @param sn string - Serial number of test unit
//  * @returns {[chargingFormat,bssid]} Object containing booleans or nulls for test results and an object containing device props
//  */
// async function mqtt(mqttClient: MqttClient): Promise<
//     {
//         bssid: string | null;
//         chargingStatus: boolean | undefined
//     }> {
//     return new Promise((resolve) => {
//         // const logger = setLogger("mqtt.js");
//         let result: {
//             bssid: string | null;
//             chargingStatus: boolean | undefined
//         } = {
//             bssid: null,
//             chargingStatus: undefined
//         }

//         mqttClient.on("connect", (connack) => {
//             // console.log("connected: " + JSON.stringify(connack))
//             // logger.debug("Connected");
//             // console.log("connected")
//             mqttClient.subscribe([
//                 `${sn}/device/status`
//             ]);
//         });

//         // const endTest = setTimeout(() => {
//         //     // logger.error("Timeout Reached. Test Incomplete")
//         //     console.log("Timeout Reached. Test Incomplete");
//         //     testManage.emit("endTest");
//         // }, 20 * 1000);
//         const testManage = new EventEmitter();
//         testManage.on("endTest", () => {
//             // clearTimeout(endTest);
//             testManage.removeAllListeners("endTest");
//             mqttClient.end();
//             // logger.debug("Closing MQTT Connection");
//             // logger.debug(JSON.stringify(results));
//             resolve(result);
//         });
//         let statusReceived = false;
//         let fuelOk = false;
//         mqttClient.on("message", (topic, payload) => {
//             // logger.debug(payload.toString());
//             // console.log(payload.toString());
//             if (topic.split(/\/(.*)/s)[1] === "device/status") {
//                 statusReceived = true;
//                 try {
//                     const msg = JSON.parse(payload.toString());
//                     if (isStatusMessage(msg)) {
//                         if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
//                             // Do Something
//                             // Confirm Fuel Gauge is operating
//                             // console.log("FUEL VALUE START");
//                             // console.log(msg.fuelRaw.toString());
//                             // console.log("FUEL VALUE END");
//                             fuelOk = true
//                             result.bssid = msg.bssid;
//                             if (msg.charging === 1) {
//                                 result.chargingStatus = true;
//                             } else if (msg.charging === 0) {
//                                 result.chargingStatus = false;
//                             }
//                             // console.log("DataFrom" + payload.toString());
//                         } else {
//                             // console.log("FUEL VALUE START");
//                             // console.log(msg.fuelRaw.toString());
//                             // console.log("FUEL VALUE END");
//                             // fuelOk = false;
//                         }
//                     } else {
//                         // console.log("failed");
//                         // Fail Condition
//                     }
//                 } catch (err) {
//                     if (err instanceof Error) {
//                         // console.log("Error:" + err);
//                     }
//                 }
//                 testManage.emit("endTest")
//             }
//             if (statusReceived) {
//                 testManage.emit("endTest")
//             }
//         });
//     })
// }

// async function a() {
//     const a = await mqtt("cr4c7525bc785c");
//     console.log("bssid:" + a.bssid);
//     console.log("ChargingStatus:" + a.chargingStatus);
// }
// a()
// export default mqtt;