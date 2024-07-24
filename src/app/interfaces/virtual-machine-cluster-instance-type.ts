export interface VirtualMachineClusterInstanceType {
    apiVersion: "instancetype.kubevirt.io/v1beta1";
    kind: "VirtualMachineClusterInstancetype";
    metadata: {
        name: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        cpu: {
            guest: number;
            maxSockets?: number;
            model?: string;
            isolateEmulatorThread?: boolean;
            dedicatedCPUPlacement?: boolean;
        };
        memory: {
            guest: string;
            overcommitPercent?: number;
            hugepages?: {
                pagesize: string;
            };
        };
        gpus?: {}
        hostDevices?: {}
    };
}
