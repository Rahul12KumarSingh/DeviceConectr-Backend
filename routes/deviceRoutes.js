const Router = require('express');
const router = Router();
const { addDeviceController, getDeviceData , updateDeviceDataController , getControllerCode , getAllDevicesController } = require('../controllers.js/deviceController');
const { authenticate } = require('../middleware.js/auth.js');




//Route for adding a device...
router.post('/device/add-device' ,  authenticate  ,  addDeviceController); 


//Route for get the generated the code...
router.get('/device/controller-code' ,  authenticate  ,  getControllerCode) ; 


//Route for getting all devices...
router.get('/device/all-devices' , authenticate , getAllDevicesController);

//Route for getting  device data...
router.get('/device/:id' , authenticate ,  getDeviceData); 


//Route for updating device data...
router.post('/device/updateData' , authenticate , updateDeviceDataController) ;



module.exports = router ; 



