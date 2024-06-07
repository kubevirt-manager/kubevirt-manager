import { KClusterKubevirtMachineTemplate } from "./kcluster-kubevirt-machine-template.model";
import { KubeVirtVM } from "./kube-virt-vm.model";

export class KClusterMachineDeployment {
    name:                                       string =  "";
    namespace:                                  string =  "";
    creationTimestamp:                           Date  =  new Date;
    annotations:                                    {} =  {};
    labels:                                         {} =  {};
    clusterName:                                string =  "";
    replicas:                                   number =  0;
    readyReplicas:                             number  =  0;
    minReplicas:                               number  =  0;
    maxReplicas:                               number  =  0;
    phase:                                     string  =  "";
    version:                                    string =  "";
    machineTemplate:   KClusterKubevirtMachineTemplate =  new KClusterKubevirtMachineTemplate;
    vmlist:                               KubeVirtVM[] =  [];
}
