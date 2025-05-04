const {
    IoTClient,
    CreateKeysAndCertificateCommand,
    CreatePolicyCommand,
    AttachPolicyCommand,
    CreateThingCommand,
    AttachThingPrincipalCommand
  } = require('@aws-sdk/client-iot');
  
  //Set the AWS region
  const REGION = 'eu-north-1';
  const AWS_IOT_ENDPOINT = 'a2taf7k0sccd5u-ats.iot.eu-north-1.amazonaws.com';
  
  // Create the IoT client
  const iotClient = new IoTClient({ region: REGION });
  
  const createCertAndPolicy = async (userId) => {
    try {
      const certCommand = new CreateKeysAndCertificateCommand({
        setAsActive: true
      });

      const certRes = await iotClient.send(certCommand);
      const policyName = "ESP32WRoom_Policy" ;
  
      
      // 3. Attach the policy to the certificate
      const attachPolicyCommand = new AttachPolicyCommand({
        policyName,
        target: certRes.certificateArn
      });
      await iotClient.send(attachPolicyCommand);
  
      // 4. Create a thing
      const thingName = `DeviceConnectr-${userId}`;
      const createThingCommand = new CreateThingCommand({ thingName });
      await iotClient.send(createThingCommand);
  
      // 5. Attach certificate to thing
      const attachPrincipalCommand = new AttachThingPrincipalCommand({
        thingName,
        principal: certRes.certificateArn
      });

      await iotClient.send(attachPrincipalCommand);
  
      // 6. Return all values
      const data = {
        certificatePem: certRes.certificatePem,
        privateKey: certRes.keyPair.PrivateKey,
        publicKey: certRes.keyPair.PublicKey,
        thingName,
        iotEndpoint: AWS_IOT_ENDPOINT
      };
  
      console.log("✅ Created certificate, policy, and thing:", data);
      return data;
  
    } catch (err) {
      console.error("❌ Error in createCertAndPolicy:", err.message);
      console.error(err.stack);
      throw err;
    }
  };
  
  module.exports = { createCertAndPolicy };
  