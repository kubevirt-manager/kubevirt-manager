import { KubeVirtVM } from "./kube-virt-vm.model";

export class K8sNode {
  name:            string = "";
  arch:            string = "";
  os:              string = "";
  cidr:            string = "";
  cpu:             string = "";
  mem:             string = "";
  disk:            string = "";
  osimg:           string = "";
  kernel:          string = "";
  criver:          string = "";
  kubever:         string = "";
  vmlist:    KubeVirtVM[] = [];
}
