/* Node Modules */
const path = require('path');

/* Local Modules */
var myUtil = require('../util/util.js');

/*
 * List Image Files
 */
exports.getImages = (req, res) => {
    var path = require('path');
    var imagePath = myUtil.getImgPath();
    imagePath = path.join(imagePath.toString());
    res.setHeader("Access-Control-Allow-Origin", "*");
    result = myUtil.walkImages(imagePath);
    res.json(result);
}

/*
 * Get Image Details
 */
exports.getImageDetails = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "") {
        var imgPath = path.join(myUtil.getImgPath() + "/" + req.params.name);
        result = myUtil.infoImage(imgPath);
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
 * Delete Image File
 */
exports.deleteImage = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "") {
        var imagePath = path.join(myUtil.getImgPath() + "/" + req.params.name);
        if(myUtil.deleteFile(imagePath) == true) {
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
 * Rename Image File
 */
exports.renameImage = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.src != "" && req.params.dst != "") {
        var path = require('path');
        var imagePath = myUtil.getImgPath();
        var srcPath = path.join(myUtil.getImgPath() + "/" + req.params.src);
        var dstPath = path.join(imagePath.toString() + "/" + req.params.dst);
        if(myUtil.renameFile(srcPath, dstPath) == true) {
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
 * Upload Image File
 */
exports.uploadImage = (req, res) => {
    myResult = {
        status: 0,
        message: ""
    };
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.params.name != "") {
        dstPath = path.join(myUtil.getImgPath() + "/" + req.params.name);
        if(myUtil.renameFile(req.file.path, dstPath) == true) {
            myResult.status = 200;
            myResult.message = "OK";
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

exports.options = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, POST, PATCH, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "destination-node");
    res.status = 200;
    res.send("OK");
}