export interface ServicesPort {
    port: number;
    targetPort: number;
    nodePort?: number;
    protocol: string;
}
