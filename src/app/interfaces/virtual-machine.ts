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
        dataVolumeTemplates?: {};
        instancetype?: {
            kind: "VirtualMachineClusterInstancetype";
            name: string;
        };
        running: false;
        template: {
            metadata: {
                labels?: {};
            },
            spec: {
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

