export interface NetworkPolicy {
    apiVersion: "networking.k8s.io/v1";
    kind: "NetworkPolicy";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        policyTypes: {};    // INGRESS OR EGRESS (we dont support both / AND)
        podSelector: {
            matchLables?: {}; // key: value
        }
        ingress?: {
            from: {
                ipblock?: {
                    cidr: string;  // XXX.XXX.XXX.XXX/XX
                },
                namespaceSelector?: {
                    matchLabels?: {};  // key: value
                },
                podSelector?: {
                    matchLabels?: {}; // key: value
                }
            },
            ports: {
                port: number;
                protocol?: string;  // TCP / UDP
            }[];
        }[],
        egress?: {
            to: {
                ipblock?: {
                    cidr: string;  // XXX.XXX.XXX.XXX/XX
                },
                namespaceSelector?: {
                    matchLabels?: {};  // key: value
                },
                podSelector?: {
                    matchLabels?: {}; // key: value
                }
            },
            ports: {
                port: number;
                protocol?: string;  // TCP / UDP
            }[];
         }[];
    };
}