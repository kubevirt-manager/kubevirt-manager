export class Services {

    serviceTemplate = {
        "apiVersion":"v1",
        "kind":"Service",
        "metadata":{
            "name":"",
            "namespace":"",
            "labels": {}
        },
        "spec":{
            "type": "",
            "ports": [{
                "port": 0,
                "protocol": "",
                "targetPort": 0
            }],
            "selector":{}
        }
    };
}
