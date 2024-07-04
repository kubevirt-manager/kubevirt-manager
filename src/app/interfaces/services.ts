import { ServicesPort } from "./services-port";

export interface Services {
    apiVersion: "v1";
    kind: "Service";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        type: string;
        ports: ServicesPort[];
        selector: {};
    }
}
