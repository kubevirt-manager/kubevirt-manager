export class Hpa {

    cpuPercentageHPA = {
        "apiVersion":"autoscaling/v1",
        "kind":"DataVoHorizontalPodAutoscalerlume",
        "metadata":{
            "name": "",
            "namespace": "",
            "labels": {}
        },
        "spec":{
            "scaleTargetRef": {
                "kind": "VirtualMachinePool",
                "apiVersion": "pool.kubevirt.io/v1alpha1",
                "name": ""
            },
            "minReplicas": 0,
            "maxReplicas": 0,
            "targetCPUUtilizationPercentage": 0 
        }
    };

}
