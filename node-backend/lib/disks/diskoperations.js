/* Node Modules */
const path = require('path');

/* Local Modules */
var myUtil = require('../util/util.js');

/*
 * List Disk Files
 */
exports.getDisks = (req, res) => {
    var path = require('path');
    var diskPath = myUtil.getDiskPath();
    diskPath = path.join(diskPath.toString());
    res.setHeader("Access-Control-Allow-Origin", "*");
    result = myUtil.walkDisks(diskPath);
    res.json(result);
}

/*
 * Delete Disk File
 */
exports.deleteDisk = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    if (req.params.name != "") {
        var diskPath = req.params.name
        diskPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        res.setHeader("Access-Control-Allow-Origin", "*");
        if(myUtil.deleteFile(diskPath) == true) {
            myResult.status = 200;
            myResult.message = "OK";
            res.status(200);
            res.json(myResult);
        } else {
            myResult.status = 500;
            myResult.message = "ERROR: File not found."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

/*
 * Resize Disk File
 */
exports.resizeDisk = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    if (req.params.name != "" && req.params.size != "") {
        var srcPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        var newSize = req.params.size;
        res.setHeader("Access-Control-Allow-Origin", "*");
        if(myUtil.resizeFile(srcPath, newSize) == true) {
            myResult.status = 200;
            myResult.message = "OK";
            res.status(200);
            res.json(myResult);
        } else {
            myResult.status = 500;
            myResult.message = "ERROR: Internal error."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

/*
 * Get Disk Details
 */
exports.getDiskDetails = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "") {
        var dskPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        result = myUtil.infoDisk(dskPath);
        if (result != false) {
            myResult.status = 200;
            myResult.message = result;
            res.status(200);
            res.json(myResult);
        } else {
            myResult.status = 500;
            myResult.message = "ERROR: Internal error."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

/*
 * New Blank Disk
 */
exports.newBlankDisk = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "" && req.params.size != "") {
        var path = require('path');
        var dskPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        result = myUtil.newBlankDisk(dskPath, req.params.size);
        console.log(result);
        if (result != false) {
            myResult.status = 200;
            myResult.message = dskPath;
            res.status(200);
            res.json(myResult);
        } else {
            myResult.status = 500;
            myResult.message = "ERROR: Internal error."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

/*
 * Upload Disk File
 */
exports.uploadDisk = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "") {
        dstPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        if(myUtil.renameFile(req.file.path, dstPath) == true) {
            myResult.status = 200;
            myResult.message = dstPath;
            res.status(200);
            res.json(myResult);
        } else {
            myUtil.deleteFile(req.file.path);
            myResult.status = 500;
            myResult.message = "ERROR: File already exists."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

/*
 * New Disk From Image
 */
exports.newDiskFromImage = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "" && req.params.image != "" && req.params.size != "") {
        var path = require('path');
        imgPath = path.join(myUtil.getImgPath() + "/" + req.params.image);
        dskPath = path.join(myUtil.getDiskPath() + "/" + req.params.name);
        result = myUtil.createDiskFromImage(dskPath, imgPath, req.params.size)
        if (result != false) {
            myResult.status = 200;
            myResult.message = dskPath;
            res.status(200);
            res.json(myResult);
        } else {
            myResult.status = 500;
            myResult.message = "ERROR: Internal error."
            res.status(500);
            res.json(myResult);
        }
    } else {
        myResult.status = 500;
        myResult.message = "ERROR: Internal error."
        res.status(500);
        res.json(myResult);
    }
}

exports.options = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, POST, PATCH, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "destination-node");
    res.status = 200;
    res.send("OK");
}
