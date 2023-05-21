export class Hpa {

    cpuPercentageHPAv1 = {
        "apiVersion":"autoscaling/v1",
        "kind":"HorizontalPodAutoscaler",
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

    cpuPercentageHPAv2 = {
        "apiVersion":"autoscaling/v2",
        "kind":"HorizontalPodAutoscaler",
        "metadata":{
            "name": "",
            "namespace": "",
            "labels": {}
        },
        "spec":{
            "scaleTargetRef": {
                "apiVersion": "pool.kubevirt.io/v1alpha1",
                "kind": "VirtualMachinePool",
                "name": ""
            },
            "minReplicas": 0,
            "maxReplicas": 0,
            "metrics": [{
                "type": "Resource",
                "resource": {
                    "name": "cpu",
                    "target": {
                        "type": "Utilization",
                        "averageUtilization": 0
                    }
                }               
            }]
        }
    };


}
