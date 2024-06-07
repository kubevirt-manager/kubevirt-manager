export interface KubeadmConfigTemplate {
    apiVersion: "bootstrap.cluster.x-k8s.io/v1beta1";
    kind: "KubeadmConfigTemplate";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        template: {
            metadata: {
                labels?: {};
            };
            spec: {
                joinConfiguration: {
                    nodeRegistration: {
                        kubeletExtraArgs: {};
                    };
                };
                useExperimentalRetryJoin: true;
            };
        };
    };
}
