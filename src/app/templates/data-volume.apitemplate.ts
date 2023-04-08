export class DataVolume {

    blankDisk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "blank":{}
            }
        }
    };

    httpDisk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "http":{
                    "url": ""
                }
            }
        }
    };

    s3Disk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "s3":{
                    "url": ""
                }
            }
        }
    };

    gcsDisk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "gcs":{
                    "url": ""
                }
            }
        }
    };

    registryDisk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "registry":{
                    "url": ""
                }
            }
        }
    };

    pvcDisk = {
        "apiVersion":"cdi.kubevirt.io/v1beta1",
        "kind":"DataVolume",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {
                "cdi.kubevirt.io/storage.deleteAfterCompletion": "false"
            }
        },
        "spec":{
            "pvc": {
                "storageClassName": "",
                "accessModes":[
                    "ReadWriteOnce"
                ],
                "resources":{
                    "requests":{
                        "storage":""
                    }
                }
            },
            "source":{
                "pvc":{
                    "name": "",
                    "namespace": ""
                }
            }
        }
    };

}
