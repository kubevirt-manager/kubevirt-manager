export interface KubevirtMachineTemplate {
    apiVersion: "infrastructure.cluster.x-k8s.io/v1alpha1";
    kind: "KubevirtMachineTemplate";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        template: {
            spec: {
                virtualMachineTemplate: {
                    metadata: {
                        namespace: string;
                        labels?: {};
                    };
                    spec: {
                        dataVolumeTemplates: {};
                        runStrategy: "Once";
                        instancetype?: {
                            kind: "VirtualMachineClusterInstancetype";
                            name: string;
                        };
                        template: {
                            metadata: {
                                labels?: {};
                            };
                            spec: {
                                priorityClassName?: string,
                                domain: {
                                    cpu?: {
                                        cores: number;
                                        sockets: number;
                                        threads: number;
                                    };
                                    resources?: {
                                        requests: {
                                            memory: string;
                                        }
                                    };
                                    devices: {
                                        disks: {};
                                        interfaces: {};
                                        networkInterfaceMultiqueue: true;
                                    };
                                };
                                networks: {};
                                volumes: {};
                            };
                        };
                    };
                };
            };
        };
    };
}
