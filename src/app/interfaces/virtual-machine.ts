export interface VirtualMachine {
    apiVersion: "kubevirt.io/v1alpha3";
    kind: "VirtualMachine";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        runStrategy: string;
        dataVolumeTemplates?: {};
        instancetype?: {
            kind: "VirtualMachineClusterInstancetype";
            name: string;
        };
        template: {
            metadata: {
                annotations?: {};
                labels?: {};
            },
            spec: {
                evictionStrategy?: string,
                nodeSelector?: {};
                priorityClassName?: string;
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
                        sockets: number;
                        threads: number;
                        cores: number;
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
                },
                networks: {};
                volumes: {};
            };
        };
    };
}

