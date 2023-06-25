import { KClusterKubevirtMachineTemplate } from "./kcluster-kubevirt-machine-template.model";
import { KubeVirtVM } from "./kube-virt-vm.model";

export class KClusterKubeadmControlPlane {
    name:                                       string =  "";
    namespace:                                  string =  "";
    labels:                                         {} =  {};
    clusterName:                                string =  "";
    dnsDomain:                                  string =  "";
    podSubnet:                                  string =  "";
    serviceSubnet:                              string =  "";
    replicas:                                   number =  0;
    version:                                    string =  "";
    initialized:                               boolean =  false;
    ready:                                     boolean =  false;
    machineTemplate:   KClusterKubevirtMachineTemplate =  new KClusterKubevirtMachineTemplate;
    vmlist:                               KubeVirtVM[] =  [];
}
