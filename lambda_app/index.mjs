import mqtt from 'mqtt';
import fs from 'fs';

const KEY_PATH = "./private.pem.key";
const CERT_PATH = "./certificate.pem.crt";
const CA_PATH = "./aws-root-ca.pem";
const CLIENT_ID = `iotconsole-2e1d5d63-6c16-4c44-8f31-22297daa0c595`; 
const HOST_link = "COLOQUE SEU HOST LINK";
const HOST = `mqtts://${HOST_link}:8883`;

const options = {
    clientId: CLIENT_ID,
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
    ca: fs.readFileSync(CA_PATH),
    protocol: 'mqtts',
    keepAlive: 300,
    clean: true,
    protocolVersion: 4 
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

export const handler = async (event) => {
    const MAX_ATTEMPT = 15;
    if (!event || !event.request || !event.request.intent) {
        return generateResponse("Invalid request.");
    }

    const intent = event.request.intent;

    switch (intent.name) {
        case "PostMessageIntent":
            const message = intent.slots && intent.slots.escolha && intent.slots.escolha.value;

            if (!message) {
                return generateResponse("Failed to get message from intent.");
            }

            try {
                await waitForConnection(client, MAX_ATTEMPT);
                client.publish('test_topic/esp32', message, (err) => {
                    if (err) {
                        console.error('Error publishing message:', err);
                    } else {
                        console.log('Message published successfully.');
                    }
                });
                return generateResponse(`Temperatura regulada para ${message}`);
            } catch (error) {
                console.error('MQTT client is not connected.');
                return generateResponse("Não consegui conectar devido a problemas de conexão.");
            }

        default:
            return generateResponse("Não conheço essa");
    }
};

function waitForConnection(client, maxAttempts) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (client.connected) {
                clearInterval(interval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                reject(new Error('Max connection attempts reached.'));
            }
            attempts++;
        }, 1000);  // Check every second
    });
}

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

