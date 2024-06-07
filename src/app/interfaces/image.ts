export interface Image {
    apiVersion: "kubevirt-manager.io/v1";
    kind: "Image";
    metadata: {
        name: string;
        namespace: string;
        annotations?: {};
        labels?: {};
    };
    spec: {
        type: string;
        credentials?: string;
        readableName: string;
        readableDescription?: string;
        http?: {
            url: string
        };
        gcs?: {
            url: string
        };
        s3?: {
            url: string
        };
        registry?: {
            url: string
        };
        pvc?: {
            name: string;
            namespace: string;
        };
    };
}