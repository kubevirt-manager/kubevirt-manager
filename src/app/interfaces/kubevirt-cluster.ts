export interface KubevirtCluster {
    apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha1";
    kind: "KubevirtCluster";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        controlPlaneServiceTemplate: {
            metadata: {
                labels?: {};
                annotations?: {};
            };
            spec: {
                type: string;
                externalTrafficPolicy: "Cluster";
            };
        };
    };
}
