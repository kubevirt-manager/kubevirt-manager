import { KubeVirtVMI } from "./kube-virt-vmi.model";

export class KubeVirtVM {
  name:       string   = "";
  namespace:  string   = "";
  running:    boolean  = false;
  status:     string   = "";
  cores:      number   = 0;
  sockets:    number   = 0;
  threads:    number   = 0;
  memory:     string   = "";
  nodeSel:    string   = "";
  vmi:        KubeVirtVMI = new KubeVirtVMI;
}
