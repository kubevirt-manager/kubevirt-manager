export class Services {

    serviceTemplate = {
        "apiVersion":"v1",
        "kind":"Service",
        "metadata":{
            "name":"",
            "namespace":"",
            "annotations": {},
            "labels": {}
        },
        "spec":{
            "type": "",
            "ports": [{}],
            "selector":{}
        }
    };

    servicePortTemplate = {
        "port": 0,
        "targetPort": 0,
        "nodePort": 0,
        "protocol": ""
    };
}
