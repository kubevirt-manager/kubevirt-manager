export interface DataVolume {
    apiVersion: "cdi.kubevirt.io/v1beta1";
    kind: "DataVolume";
    metadata: {
        name: string;
        namespace: string;
        annotations: {
            "cdi.kubevirt.io/storage.deleteAfterCompletion": "false";
        };
        labels?: {};
    };
    spec: {
        pvc?: {
            storageClassName: string;
            accessModes: string[];
            resources: {
                requests: {
                    storage: string;
                };
            };
        };
        storage?: {};
        source: {
            blank?: {};
            gcs?: {
                url: string
            };
            s3?: {
                url: string
            };
            http?: {
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
    };
}
