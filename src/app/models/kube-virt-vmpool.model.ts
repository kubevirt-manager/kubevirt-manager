import { HealthCheck } from "./health-check.model";
import { KubeVirtVM } from "./kube-virt-vm.model";

export class KubeVirtVMPool {
    name:            string   = "";
    namespace:       string   = "";
    replicas:        number   = 0;
    running:         boolean  = false;
    status:          string   = "";
    cores:           number   = 0;
    sockets:         number   = 0;
    threads:         number   = 0;
    memory:          string   = "";
    instType:        string   = "";
    vmlist:      KubeVirtVM[] = [];
    healthCheck:  HealthCheck = new HealthCheck;
}
