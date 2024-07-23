export interface VirtualMachinePool {
    apiVersion: "pool.kubevirt.io/v1alpha1";
    kind: "VirtualMachinePool";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        replicas: number;
        selector: {
            matchLabels: {};
        };
        virtualMachineTemplate: {
            metadata: {
                labels?: {};
            };
            spec: {
                dataVolumeTemplates: {};
                instancetype?: {
                    kind: "VirtualMachineClusterInstancetype";
                    name: string;
                };
                running: true;
                template: {
                    metadata: {
                        labels?: {}
                    };
                    spec: {
                        domain: {
                            firmware?: {
                                bootloader?: {
                                    efi?: {
                                        secureBoot?: false|true;
                                    };
                                    bios?: {
                                        useSerial?: false|true;
                                    };
                                }
                            };
                            features?: {
                                smm?: {
                                    enabled?: false|true;
                                }
                            };
                            cpu?: {
                                cores: number;
                                sockets: number;
                                threads: number;
                            };
                            resources?: {
                                requests: {
                                    memory: string;
                                };
                            };
                            devices: {
                                disks: {};
                                interfaces: {};
                                networkInterfaceMultiqueue: true;
                            };
                        };
                        priorityClassName?: string;
                        networks: {};
                        volumes: {};
                        readinessProbe?: {},
                        livenessProbe?: {}
                    };
                };
            };
        };
    };
}
