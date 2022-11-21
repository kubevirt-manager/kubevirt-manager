/* Node Modules */
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { info } = require('console');
const { stdout } = require('process');

module.exports = {
    getImgPath,
    getDiskPath,
    fixImgPath,
    fixDiskPath,
    getFilesize,
    walkDisks,
    walkImages,
    deleteFile,
    renameFile,
    resizeFile,
    infoImage,
    infoDisk,
    newBlankDisk,
    createDiskFromImage
};

const IMGPATH = process.env.IMGPATH || "/tmp";
const DISKPATH = process.env.DISKPATH || "/tmp";

function getImgPath() {
    return IMGPATH.toString();
}

function getDiskPath() {
    return DISKPATH.toString();
}

function fixImgPath(file) {
    return file.replace(IMGPATH + "/", '');
}

function fixDiskPath(file) {
    return file.replace(DISKPATH + "/", '');
}

function getFilesize(file) {
    var stats = fs.statSync(file);
    var fileSize = stats.size  / (1024*1024*1024);
    var retVal = (Math.round(fileSize * 100) / 100).toFixed(2).toString() + "GiB";
    return retVal.toString();
}

function deleteFile(file) {
    try {
        const myPath = path.join(file);
        fs.unlinkSync(myPath);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

function renameFile(src, dst) {
    if(fs.existsSync(src)==true && fs.existsSync(dst) == false) {
        const { stdout, stderr } = exec("mv " + src + " " + dst);
        return true;
    } else {
        return false;
    }
}

function createDiskFromImage(disk, image, size) {
    if(fs.existsSync(image) == true && fs.existsSync(disk) == false) {
        try{
            var stdout = exec("qemu-img convert " + image + " " + disk + 
                              " && qemu-img resize " + disk + " +" + size + "G");
            console.log(stdout);
            return true;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

function resizeFile(diskFile, newSize) {
    if(fs.existsSync(diskFile) == true) {
        const { stdout, stderr } = exec("qemu-img resize " + diskFile + " " + "+" + newSize + "G");
        return true;
    } else {
        return false;
    }
}

function infoDisk(thisDisk) {
    if(fs.existsSync(thisDisk) == true) {
        var stdout = execSync("qemu-img info " + thisDisk).toString();
        return stdout;
    } else {
        return false;
    }
}

function infoImage(thisImage) {
    if(fs.existsSync(thisImage) == true) {
        var stdout = execSync("qemu-img info " + thisImage).toString();
        return stdout;
    } else {
        return false;
    }
}

function newBlankDisk(thisDisk, diskSize) {
    if(fs.existsSync(thisDisk) == false) {
        var stdout = execSync("qemu-img create " + thisDisk + " " + diskSize + "G").toString();
        return stdout;
    } else {
        return false;
    }
}

function walkDisks(dir) {
    var results = [];
    try {
        var list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory() == true) { 
                /* Recurse into a subdirectory */
                results = results.concat(walkDisks(file));
            } else { 
                /* Is a file */
                if (file.toLowerCase().includes("img") || file.toLowerCase().includes("qcow2")) {
                    var filename = fixDiskPath(file);
                    var filesize = getFilesize(file);
                    var filepath = file;
                    var fileentry = {
                        "name": filename,
                        "size": filesize,
                        "path": filepath
                    };
                    results.push(fileentry);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
    return results;
}

function walkImages(dir) {
    var results = [];
    try {
        var list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory() == true) { 
                /* Recurse into a subdirectory */
                results = results.concat(walkImages(file));
            } else { 
                /* Is a file */
                if (file.toLowerCase().includes("img") || file.toLowerCase().includes("qcow2")) {
                    var filename = fixImgPath(file);
                    var filesize = getFilesize(file);
                    var filepath = file;
                    var fileentry = {
                        "name": filename,
                        "size": filesize,
                        "path": file
                    };
                    results.push(fileentry);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
    return results;
}

