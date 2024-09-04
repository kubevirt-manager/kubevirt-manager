import { DataVolume } from "./data-volume.model";

export class VMDisk {
    id:              number  = 0;
    name:            string  = "";
    namespace:       string  = "";
    backend:         string  = "";
    type:            string  = "";
    size:            string  = "";
    bus:             string  = "";
    dataVolume:   DataVolume = new DataVolume;
    status:          string  = "";
    progress:        string  = "";
    storageClass:    string  = "";
    accessMode:      string  = "";
    cacheMode:       string  = "";
    creationTime:    string  = "";
    succeeded:       boolean = false;
    bound:           boolean = false;
    hotplug:         boolean = false;
}