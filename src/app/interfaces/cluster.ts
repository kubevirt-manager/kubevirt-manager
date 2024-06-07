export interface Cluster {
    apiVersion: "cluster.x-k8s.io/v1beta1";
    kind: "Cluster";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        clusterNetwork: {
            pods: {
                cidrBlocks: string[]
            };
            services: {
                cidrBlocks: string[]
            };
        };
        controlPlaneRef: {
            apiVersion: "controlplane.cluster.x-k8s.io/v1beta1";
            kind: "KubeadmControlPlane";
            name: string;
            namespace: string;
        };
        infrastructureRef: {
            apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha1";
            kind: "KubevirtCluster";
            name: string;
            namespace: string;
        };
    };
}
