export interface ConfigMap {
    apiVersion: "v1";
    kind: "ConfigMap";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    data: {};
}
