export interface ServiceAccount {
    apiVersion: "v1";
    kind: "ServiceAccount";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
}
