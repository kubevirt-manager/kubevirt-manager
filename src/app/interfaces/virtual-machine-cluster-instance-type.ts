export interface VirtualMachineClusterInstanceType {
    apiVersion: "instancetype.kubevirt.io/v1alpha1";
    kind: "VirtualMachineClusterInstancetype";
    metadata: {
        name: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        cpu: {
            guest: number;
        };
        memory: {
            guest: string;
        };
    };
}
