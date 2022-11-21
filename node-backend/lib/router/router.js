/* Upload file */
const multer = require('multer');

/* Local Modules */
var diskOperations = require('../disks/diskoperations.js');
var imageOperations = require('../images/imageoperations.js');
var myUtil = require('../util/util.js');

exports.startRouter = (router) => {
    
    /* Disk Operations */
    router.get('/worker/disks', diskOperations.getDisks);
    router.get('/worker/disk/:name', diskOperations.getDiskDetails);
    router.patch('/worker/disk/:name/:size', diskOperations.resizeDisk);
    router.post('/worker/disk/:name', dskUpload.single('file'), diskOperations.uploadDisk);
    router.put('/worker/disk/:name/:size', diskOperations.newBlankDisk);
    router.put('/worker/disk/:name/:image/:size', diskOperations.newDiskFromImage);
    router.delete('/worker/disk/:name', diskOperations.deleteDisk);

    /* Disk Options */
    router.options('/worker/disks', diskOperations.options);
    router.options('/worker/disk/:one', diskOperations.options);
    router.options('/worker/disk/:one/:two', diskOperations.options);
    router.options('/worker/disk/:one/:two/:three', diskOperations.options);

    /* Image Operations */
    router.get('/worker/images', imageOperations.getImages);
    router.get('/worker/image/:name', imageOperations.getImageDetails);
    router.delete('/worker/image/:name', imageOperations.deleteImage);
    router.post('/worker/image/:name', imgUpload.single('file'), imageOperations.uploadImage);
    router.patch('/worker/image/:src/:dst', imageOperations.renameImage);
    router.put('/worker/image/:name/:disk', imageOperations.renameImage);

    /* Image Options */
    router.options('/worker/images', imageOperations.options);
    router.options('/worker/image/:one', imageOperations.options);
    router.options('/worker/image/:one/:two', imageOperations.options);
    router.options('/worker/image/:one/:two/:three', imageOperations.options);
}

let IMGPATH = myUtil.getImgPath();
let DISKPATH = myUtil.getDiskPath();

let imgUpload = multer({
    dest: IMGPATH
});

let dskUpload = multer({
    dest: DISKPATH
});
