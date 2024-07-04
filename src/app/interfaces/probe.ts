export interface Probe {
    httpGet?: {
        path: string;
        port: number;
    };
    tcpSocket?: {
        port: number;
    };
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    failureThreshold: number;
    successThreshold: number;
}
