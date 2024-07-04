export interface ClusterResourceSet {
    apiVersion: "addons.cluster.x-k8s.io/v1beta1";
    kind: "ClusterResourceSet";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        clusterSelector: {
            matchLabels: {
                "kubevirt-manager.io/cluster-name": string;
                "capk.kubevirt-manager.io/cni": string;
            };
        };
        resources:
            {
                kind: "Secret";
                name: string;
                namespace: string;
            }[];
    };
}
