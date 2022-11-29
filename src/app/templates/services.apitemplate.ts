export class Services {

    serviceTemplate = {
        "apiVersion":"v1",
        "kind":"Service",
        "metadata":{
            "name":"",
            "namespace":"",
            "labels": {
                "kubevirt.io/vmpool": ""
            }
        },
        "spec":{
            "type": "ClusterIP",
            "ports": [{
                "port": 80,
                "protocol": "TCP",
                "targetPort": 90
            }],
            "selector":{
                "kubevirt.io/vmpool": ""
            }
        }
    };
}
