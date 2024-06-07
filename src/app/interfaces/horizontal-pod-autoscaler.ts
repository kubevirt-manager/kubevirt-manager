export interface HorizontalPodAutoscaler {
    apiVersion: "autoscaling/v2";
    kind: "HorizontalPodAutoscaler";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        scaleTargetRef: {
            apiVersion: "pool.kubevirt.io/v1alpha1";
            kind: "VirtualMachinePool";
            name: string;
        };
        minReplicas: number;
        maxReplicas: number;
        metrics: {
            type: "Resource";
            resource: {
                name: "cpu";
                target: {
                    type: "Utilization";
                    averageUtilization: number;
                }
            };             
        }[];
    };
}
