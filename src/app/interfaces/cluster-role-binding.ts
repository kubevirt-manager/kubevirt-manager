export interface ClusterRoleBinding {
    apiVersion: "rbac.authorization.k8s.io/v1";
    kind: "ClusterRoleBinding";
    metadata: {
        name: string;
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
