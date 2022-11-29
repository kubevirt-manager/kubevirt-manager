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

    urlDisk = {
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
