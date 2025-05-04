const Device = require('../models/device');
const User = require('../models/user');
const { generateControllerCode } = require('../utils/microController');

// add Device Controller....
const addDeviceController = async (req, res) => {
    const { deviceName, deviceType } = req.body;
    const email = req.user.email;

    console.log("user email : ", email);

    try {
        if (!deviceName || !deviceType) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }
        //creating the device....
        const device = await Device.create({
            type: deviceType,
            deviceName: deviceName
            // userId: user._id
        });

        console.log("device : ", device);

        //pushing the device to the user devices array....
        await User.updateOne({ email }, {
            $push: {
                devices: device._id
            }
        });

        // createTopicAndAddCloudFunction(deviceName._id);

        return res.status(200).json({
            success: true,
            message: "Device added successfully",
            device: device
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while adding the device",
            error: error.message
        });
    }
};


//get controller code....
const getControllerCode = async (req, res) => {
    const email = req.user.email;

    try {
        //const controllerCode = generateControllerCode(email)
        const controllerCode = `#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <WiFiManager.h>
#include <DHT.h>

// MQTT Config
const char* mqtt_server = "a2f276cdb18d48f284666da86175b258.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "DeviceConectr";
const char* mqtt_password = "Kasia@1234";

WiFiClientSecure espClient;
PubSubClient client(espClient);

// DHT22 Config
#define DHTPIN 4          
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Relay Pins
#define BULB_PIN 19
#define FAN_PIN 21

unsigned long lastTempPublishTime = 0;
const unsigned long publishInterval = 1000;  // 10 seconds

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';  // Null-terminate payload
  String msg = String((char*)payload);
  
  Serial.print("📨 Message received on topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(msg);

  if (String(topic) == "bulb") {
    if (msg == "true") {
      digitalWrite(BULB_PIN, HIGH);
      Serial.println("💡 Bulb ON");
    } else {
      digitalWrite(BULB_PIN, LOW);
      Serial.println("💡 Bulb OFF");
    }
  }

  if (String(topic) == "fan") {
    if (msg == "on") {
      digitalWrite(FAN_PIN, HIGH);
      Serial.println("🌀 Fan ON");
    } else {
      digitalWrite(FAN_PIN, LOW);
      Serial.println("🌀 Fan OFF");
    }
  }
}

void setup_wifi() {
  WiFiManager wifiManager;
  wifiManager.autoConnect("ESP32_AP_Config");
  Serial.println("✅ WiFi connected");
  Serial.println("IP: " + WiFi.localIP().toString());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔁 Attempting MQTT connection...");
    if (client.connect("rahulesp32323", mqtt_user, mqtt_password)) {
      Serial.println("✅ Connected");

      client.subscribe("bulb");
      client.subscribe("fan");
    } else {
      Serial.print("❌ Failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Initialize relay pins
  pinMode(BULB_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(BULB_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);

  dht.begin();
  setup_wifi();

  espClient.setInsecure();  // Skip certificate validation
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  // Periodically read temperature and publish
  unsigned long now = millis();
  if (now - lastTempPublishTime > publishInterval) {
    float temp = dht.readTemperature();

    if (!isnan(temp)) {
      char tempStr[8];
      dtostrf(temp, 1, 2, tempStr);
      client.publish("temp", tempStr);
      Serial.print("🌡️ Temperature Published: ");
      Serial.println(tempStr);
    } else {
      Serial.println("⚠️ Failed to read temperature from DHT sensor");
    }

    lastTempPublishTime = now;
  }
}
`

        await User.updateOne({ email }, {
            controllerCode: controllerCode
        })

        res.status(200).json({
            success: true,
            message: "Controller code generated successfully",
            controllerCode: controllerCode
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Error while generating the controller code..",
            error: error.message
        })
    }

};


// get device data....
const getDeviceData = async (req, res) => {
    const deviceId = req.params.id;

    try {
        const device = await Device.findById(deviceId)
        const type = device.type;

        if ((type == 1) || (type == 0)) {
            return res.status(200).json({
                success: true,
                data: device.status
            })
        }

        return res.status(200).json({
            success: true,
            data: device.dataPoints
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while fetching the device data",
        })

    }
}

//update device data....
const updateDeviceDataController = async (req, res) => {
    const deviceId = req.body.deviceId;
    const { val, dataPoint } = req.body;

    if (!deviceId) {
        return res.status(400).json({
            success: false,
            message: "deviceId is required!!!"
        })
    }

    try {
        if (dataPoint) {
            await Device.findByIdAndUpdate(deviceId, {
                $push: {
                    dataPoints: dataPoint
                }
            })
        }
        else {
            await Device.findByIdAndUpdate(deviceId, {
                status: val
            })
        }

        return res.status(200).json({
            success: true,
            message: "Device data updated successfully...."
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while updating the device data....",
            error: err.message
        })
    }
}

// get all devices controller....
const getAllDevicesController = async (req, res) => {
    const email = req.user.email;

    try {
        const user = await User.findOne({ email }).populate('devices');
        const devices = user.devices;

        return res.status(200).json({
            success: true,
            devices: devices
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching the devices...",
            error: err.message
        })
    }
}


module.exports = { addDeviceController, getControllerCode, updateDeviceDataController, getDeviceData, getAllDevicesController };