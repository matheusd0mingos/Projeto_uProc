import mqtt from 'mqtt';
import fs from 'fs';

const KEY_PATH = "./private.pem.key";
const CERT_PATH = "./certificate.pem.crt";
const CA_PATH = "./aws-root-ca.pem";
const CLIENT_ID = `iotconsole-2e1d5d63-6c16-4c44-8f31-22297daa0c595`; // Randomized client ID
const HOST_link = "apbitammihdhj-ats.iot.us-east-1.amazonaws.com";
const HOST = `mqtts://${HOST_link}:8883`;

const options = {
    clientId: CLIENT_ID,
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
    ca: fs.readFileSync(CA_PATH),
    protocol: 'mqtts',
    keepAlive: 30, // Increased keepAlive
    clean: true, // Set clean session
    protocolVersion: 4 // Explicitly set MQTT 3.1.1
};

console.log("Initializing...");

const client = mqtt.connect(HOST, options);

client.on('connect', () => {
    console.log('MQTT connected successfully.');
});


client.on('message', (topic, payload) => {
    console.log('Received message:', topic, payload.toString());
});

client.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

client.on('close', () => {
    console.log('MQTT connection closed.');
});

client.on('reconnect', () => {
    console.log('MQTT trying to reconnect.');
});
const message = "Hello World!";
client.publish('test_topic/esp32', message, (err) => {
    if (err) {
        console.error('Error publishing message:', err);
    } else {
        console.log('Message published successfully.');
    }
});


function generateResponse(text) {
    return {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: text
            }
        }
    };
}

