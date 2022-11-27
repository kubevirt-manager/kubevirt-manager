import { KubeVirtVM } from "./kube-virt-vm.model";

export class KubeVirtVMPool {
    name:            string = "";
    namespace:       string = "";
    vmlist:    KubeVirtVM[] = [];
}
