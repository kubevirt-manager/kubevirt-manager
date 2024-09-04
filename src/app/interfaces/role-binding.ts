export interface RoleBinding {
    apiVersion: "rbac.authorization.k8s.io/v1";
    kind: "RoleBinding";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    roleRef: {
        apiGroup: "rbac.authorization.k8s.io";
        kind: string;
        name: string;
    };
    subjects: {
        apiGroup?: string;
        kind: string;
        name: string;
        namespace?: string;
    }[];
}
