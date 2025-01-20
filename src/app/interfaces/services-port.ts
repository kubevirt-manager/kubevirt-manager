export interface ServicesPort {
    name: string;
    port: number;
    targetPort: number;
    nodePort?: number;
    protocol: string;
}
