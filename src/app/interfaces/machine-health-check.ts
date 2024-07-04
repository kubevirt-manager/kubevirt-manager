export interface MachineHealthCheck {
    apiVersion: "cluster.x-k8s.io/v1beta1";
    kind: "MachineHealthCheck";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        clusterName: string;
        maxUnhealthy: string;
        nodeStartupTimeout: string;
        selector: {};
        remediationTemplate?: {};
        unhealthyConditions: {
            type: string;
            status: string;
            timeout: string;
        }[];
        unhealthyRange?: string;
    };
}
