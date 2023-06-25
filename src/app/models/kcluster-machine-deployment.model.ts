import { KClusterKubevirtMachineTemplate } from "./kcluster-kubevirt-machine-template.model";
import { KubeVirtVM } from "./kube-virt-vm.model";

export class KClusterMachineDeployment {
    name:                                       string =  "";
    namespace:                                  string =  "";
    labels:                                         {} =  {};
    clusterName:                                string =  "";
    replicas:                                   number =  0;
    version:                                    string =  "";
    machineTemplate:   KClusterKubevirtMachineTemplate =  new KClusterKubevirtMachineTemplate;
    vmlist:                               KubeVirtVM[] =  [];
}
