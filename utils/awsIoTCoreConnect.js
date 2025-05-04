const mqtt = require('mqtt');


const awsIotCoreConnect = async () => {
    const AWS_IOT_ENDPOINT = 'a2taf7k0sccd5u-ats.iot.eu-north-1.amazonaws.com';
    const TOPIC = 'esp32/pub';

    // const privateKey = path.join(__dirname, '../key/private.pem.key');
    // const deviceCert = path.join(__dirname, '../key/deviceCertificate.pem.crt');
    // const caCert = path.join(__dirname, '../key/AmazonRootCA1.pem');


    const options = {
        host: AWS_IOT_ENDPOINT,
        port: 8883,
        protocol: 'mqtts',
        key: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAltR+0dYRU7k+0fy8OekTNaZq5IYppo0Q/9cF9UVf9yAoJvrn
6VyCoL6Gp9rdhWu1L6kfy+E5BLsHjPCxnjrOdCHARh2nGghKFX5AFwh34g+gGz/q
zYY6om9/Sks5LuF5iaT8RGp6hwbSYn58E8qqML583F2CtVoRmFZ35CxdYCJi548M
VXFvJJQtZvUpDHiPG8VFEbPccVIEyvZ3WxMK8q+MIN8W77T5ueTbw6uSgPFgnCIG
up0bW5qZY0x+rqeouhcL69LPPX3G4o11+zl9IeL2cx49Q9HhmxnXsNEDQacFqnUW
fLCvHZq7XqSjQwDqgiM5q7o5zkfvYCmxVt+VTwIDAQABAoIBAFdj/6bs9VUhO/jH
Cvgyx2KKbdzCr1dE3NifaWBXNeclxp3vOnfHlhg0zChtc3Rel7hpsXabpEHNa+6J
dyBKylwXQiReAfffXa1eXRv7WBqvGwEu44j5gPekyoftVdCH67eI1HF/kEaz+SoA
RzvgbQOZGxdDRvx0l0VAtG6MFf4giqB2KfnZ67y3T0SERKsiKitMVRXAaS1MOMJu
YPYW24mfuLBj2H4O9ulaiF+i6L5kxQNTxS92GT0qGk1/84/ZvsfSZYn3q1s8MR9l
1eLtvJGlly0ptwQCsNYv4Kj+YyOK2QwOH6/KB+qEFmrXKw32nRk5D5A5Ph4oYryS
mS7ReaECgYEAxP3azWUzUSH1P+rwkaIPf7SxoJZbYq6g87wQdLsoV5sMkxQrCI8p
wIuKnWAqUrRIS2xkdMhT3nlvuJl30axnml39x4gBW4sUhmdwKhJvRp0030v+ROIM
OusgtvMtM8j58U7r98lt9K5ne95iT5XjbssEZj9XPGqpotUBuBxO+6UCgYEAxALH
Pcdcau4UBQBEtimP4luElCcQGk/bEVZCdUJeYQj6aXmsolxJY8mDJDBaVTrI08No
Z3OElocMtJCXUXTTQKSh9HThWos7FOCuGhh/WvSGjQj4MT6DrvzFYrJfvoXga9HY
s7VTV5GcQI9ZnSCax4V1jBYc8Kol1I9TusNaCuMCgYEAjGLhOLljbfGGZyvWj+Lv
qrIqWGhu7g/HcovXKmlq4awEtRiNZocoWSjY+zjaUKBcWSwBF1zgsE7YuLTeOBXm
q5NKVZVuaj/eu74hqEoE9Uz5rhzpM0vpLV/9q4P39czHmxoEfk0VyGc2Joeghlkq
gP27v+ZqFAtrozisBfpeq2UCgYA3a5muDApDaaFbcKH85295TusDgK/64I1OL5eG
1AcfZIx4+iAnn/RYNIfR2aIQ6xgRV/TTG0Rn0zNycld2fpOkeWgZWFrHYQqJcqWH
V1na+7x3cAvM0KIm/e1JZKnRksTLd3/P//rajZ8iWeW6mZdpxoBf5Xi1S0Z6/TNt
YQK6hQKBgDxL1Qe0R3vOMFAaynnxTo5Q0VYgLoqnIh7Ar768lPMk1NGzAuEcDw//
ZNdqDgVBBlQPyqk7754hvnp25bgR8p+mupbBCaFCKi5YpIGxltToYJsfjvmAS76E
3Vii27ErJO4h3yPxcgOVye9sgLFPx+cvesaSaWLkBktFiQV5rJB/
-----END RSA PRIVATE KEY-----`,
        cert: `-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIUHvnjgrCWLC8C5ma6sCeHMy/QtA0wDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI1MDQyMzEwMzEz
M1oXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJbUftHWEVO5PtH8vDnp
EzWmauSGKaaNEP/XBfVFX/cgKCb65+lcgqC+hqfa3YVrtS+pH8vhOQS7B4zwsZ46
znQhwEYdpxoIShV+QBcId+IPoBs/6s2GOqJvf0pLOS7heYmk/ERqeocG0mJ+fBPK
qjC+fNxdgrVaEZhWd+QsXWAiYuePDFVxbySULWb1KQx4jxvFRRGz3HFSBMr2d1sT
CvKvjCDfFu+0+bnk28OrkoDxYJwiBrqdG1uamWNMfq6nqLoXC+vSzz19xuKNdfs5
fSHi9nMePUPR4ZsZ17DRA0GnBap1Fnywrx2au16ko0MA6oIjOau6Oc5H72ApsVbf
lU8CAwEAAaNgMF4wHwYDVR0jBBgwFoAUQsL48W+Shoi3vZq4qu7VajDY5powHQYD
VR0OBBYEFOGPKLx6zXMas0YIoqBKzCSKQV2wMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAzYtdwLnA0QTYtNc/MJt4FM89n
nJv/3XDzy2xzq11w9CN4GNVL0qUlYASm/5VxWmkNHQ3UPzgNZJ2uU6JlcmXfDZ/f
3rMF7BvLmOCU26bLO341ZQk9uSnek96KXexe94f3reTqzF6UwhUuTh6Jb/eFwjKi
4LV5yd1ezk+JXrRBKrXXiH72XzvJ+RywCzxZ1XLsmEJxiBbfXBNiP4YMtu66sZlf
sqvK0l79OSUUfTtIYb75vm/hlBpAj0T0D7y5U9oPAIkKgvMcOg+aA6/HhlRHGVok
muXLK8Kz1BzvIaVWNc8wV7rIZaOehnkBOsr0dMyCr+aNjSooL0ZhFgoK3+mB
-----END CERTIFICATE-----`,
        ca: `-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----`,
        rejectUnauthorized: true,
        clientId: 'DeviceConnectrBackend',
    }

    // console.log("options : " , options) ;

    const client = mqtt.connect(options);

    client.on('connect', () => {
        console.log("Connected to AWS IoT Core");

        client.subscribe(TOPIC, (err) => {
            if (err) {
                console.log("Error while subscribing to the topic : ", err);
            } else {
                console.log("Subscribed to the topic : ", TOPIC);
            }
        });
    })


    client.on('message', (topic, message) => {
        console.log("Message received : ", message.toString());
    });



    client.on('error', (err) => {
        console.log('connection error : ', err)
    });


    client.on('close', () => {
        console.log('connection closed');
    })

}



module.exports = {awsIotCoreConnect};