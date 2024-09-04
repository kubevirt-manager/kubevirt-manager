import { KubeVirtVM } from "./kube-virt-vm.model";
import { LivenessProbe } from "./liveness-probe.model";
import { ReadinessProbe } from "./readiness-probe.model";

export class KubeVirtVMPool {
    name:                   string  = "";
    namespace:              string  = "";
    creationTimestamp:        Date  = new Date;
    replicas:               number  = 0;
    readyReplicas:          number  = 0;
    running:               boolean  = false;
    status:                 string  = "";
    cores:                  number  = 0;
    sockets:                number  = 0;
    threads:                number  = 0;
    memory:                 string  = "";
    instType:               string  = "";
    priorityClass:          string  = "";
    firmware:               string  = "";
    secureBoot:            boolean  = false;
    labels:                   [{}]  = [{}];
    vmlist:           KubeVirtVM[]  = [];
    hasLiveness:           boolean  = false;
    livenessProbe:   LivenessProbe  = new LivenessProbe;
    hasReadiness:          boolean  = false;
    readinessProbe: ReadinessProbe  = new ReadinessProbe;
}
