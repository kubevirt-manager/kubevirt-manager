export interface MachineDeployment {
    apiVersion: "cluster.x-k8s.io/v1beta1";
    kind: "MachineDeployment";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        clusterName: string;
        replicas: number;
        selector: {};
        template: {
            metadata: {
                labels?: {};
            };
            spec: {
                bootstrap: {
                    configRef: {
                        apiVersion: "bootstrap.cluster.x-k8s.io/v1beta1";
                        kind: "KubeadmConfigTemplate";
                        name: string;
                        namespace: string;
                    };
                };
                clusterName: string;
                infrastructureRef: {
                    apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha1";
                    kind: "KubevirtMachineTemplate";
                    name: string;
                    namespace: string;
                };
                version: string;
            };
        };
    };
}
