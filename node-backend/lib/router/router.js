/* Upload file */
const multer = require('multer');

/* Local Modules */
var diskOperations = require('../disks/diskoperations.js');
var imageOperations = require('../images/imageoperations.js');
var myUtil = require('../util/util.js');

exports.startRouter = (router) => {
    
    /* Disk Operations */
    router.get('/worker/disks', diskOperations.getDisks);                                         /* OK */
    router.get('/worker/disk/:name', diskOperations.getDiskDetails);                              /* OK */
    router.patch('/worker/disk/:name/:size', diskOperations.resizeDisk);                          /* OK */
    router.post('/worker/disk/:name', dskUpload.single('file'), diskOperations.uploadDisk);       /* OK */
    router.put('/worker/disk/:name/:size', diskOperations.newBlankDisk);                          /* OK */
    router.put('/worker/disk/:name/:image/:size', diskOperations.newDiskFromImage);               /* NEW DISK FROM IMAGE */
    router.delete('/worker/disk/:name', diskOperations.deleteDisk);                               /* OK */

    /* Disk Options */
    router.options('/worker/disks', diskOperations.options);
    router.options('/worker/disk/:one', diskOperations.options);
    router.options('/worker/disk/:one/:two', diskOperations.options);
    router.options('/worker/disk/:one/:two/:three', diskOperations.options);

    /* Image Operations */
    router.get('/worker/images', imageOperations.getImages);                                      /* OK */
    router.get('/worker/image/:name', imageOperations.getImageDetails);                           /* OK */
    router.delete('/worker/image/:name', imageOperations.deleteImage);                            /* OK */
    router.post('/worker/image/:name', imgUpload.single('file'), imageOperations.uploadImage);    /* OK */
    router.patch('/worker/image/:src/:dst', imageOperations.renameImage);                         /* OK */
    router.put('/worker/image/:name/:disk', imageOperations.renameImage);                         /* NEW DISK FROM IMAGE */

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
