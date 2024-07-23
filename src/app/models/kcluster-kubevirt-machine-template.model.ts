export class KClusterKubevirtMachineTemplate {
    name:               string  = "";
    namespace:          string  = "";
    labels:                 {}  =  {};
    clusterName:        string  = "";
    cores:              number  = 0;
    sockets:            number  = 0;
    threads:            number  = 0;
    memory:             string  = "";
    instType:           string  = "";
    priorityClass:      string  = "";
    firmware:           string  = "";
    secureBoot:        boolean  = false;
}
