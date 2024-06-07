export interface Deployment {
    apiVersion: "apps/v1";
    kind: "Deployment";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    },
    spec: {
        replicas: number;
        selector: {
            matchLabels: {};
        },
        template: {
            metadata: {
                labels?: {};
                annotations?: {};
            },
            spec: {
                containers: 
                    {
                        name: string;
                        image: string;
                        args: string[];
                        command: string[];
                        workingDir?: string;
                        imagePullPolicy?: string;
                        imagePullSecrets?: {};
                        ports?:
                            {
                                name: string;
                                containerPort: number;
                                hostIP?: string;
                                hostPort?: string;
                                protocol?: string;
                            }[];
                        resources?: {
                            requests?: {};
                            limits?: {};
                            claims?: {};
                        };
                        securityContext?: {
                            runAsUser?: number;
                            runAsNonRoot?: boolean;
                            runAsGroup?: number;
                            procMount?: string;
                            readOnlyRootFilesystem?: boolean;
                            privileged?: boolean;
                            allowPrivilegeEscalation?: boolean;
                        };
                        volumeMounts?:
                            {
                                mountPath: string
                                name: string;
                                readOnly?: boolean;
                            }[];
                        env?:
                            {
                                name: string;
                                value?: string;
                                valueFrom?: {};
                            }[];
                        envFrom?: {};
                    }[];
                serviceAccountName?: string;
                volumes?:
                    {
                        name: string;
                        persistentVolumeClaim?: {
                            claimName: string;
                            readOnly?: boolean;
                        };
                        configMap?: {
                            name: string;
                            optional: boolean;
                            defaultMode?: number;
                            items?: {};
                        };
                        secret?: {
                            secretName: string;
                            optional: boolean;
                            defaultMode?: number;
                            items?: {};
                        }
                    }[];
                strategy?: {
                    type: string;
                    rollingUpdate?: {
                        maxSurge?: number;
                        maxUnavailable?: number;
                    };
                };
                revisionHistoryLimit?: number;
            }
        }
    }
}