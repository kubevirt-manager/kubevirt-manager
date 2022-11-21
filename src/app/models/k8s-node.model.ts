import { KubeVirtVM } from "./kube-virt-vm.model";
import { VMDisk } from "./vmdisk.model";
import { VMImage } from "./vmimage.model";

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
  imglist:      VMImage[] = [];
  disklist:      VMDisk[] = [];
}
