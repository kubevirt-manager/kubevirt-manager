export interface Secret {
    apiVersion: "v1";
    kind: "Secret";
    type?: string;
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    data: {};
}
