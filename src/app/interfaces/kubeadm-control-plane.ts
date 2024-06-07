export interface KubeadmControlPlane {
    apiVersion: "controlplane.cluster.x-k8s.io/v1beta1";
    kind: "KubeadmControlPlane";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        kubeadmConfigSpec: {
            clusterConfiguration: {
                networking: {
                    dnsDomain: string;
                    podSubnet: string;
                    serviceSubnet: string;
                };
            };
            initConfiguration: {
                nodeRegistration: {
                    criSocket: "/var/run/containerd/containerd.sock";
                };
            };
            joinConfiguration: {
                nodeRegistration: {
                    criSocket: "/var/run/containerd/containerd.sock";
                };
            };
            useExperimentalRetryJoin: true;
        };
        machineTemplate: {
            infrastructureRef: {
                apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha1";
                kind: "KubevirtMachineTemplate";
                name: string;
                namespace: string;
            };
        };
        replicas: number;
        version: string;
    }
}
