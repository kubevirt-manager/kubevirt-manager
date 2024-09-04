import { KubeVirtVMI } from "./kube-virt-vmi.model";
import { VMDisk } from "./vmdisk.model";
import { VMNewtork } from "./vmnewtork.model";

export class KubeVirtVM {
  name:               string  = "";
  namespace:          string  = "";
  labels:                 {}  = {};
  creationTimestamp:   Date   = new Date;
  running:           boolean  = false;
  ready:             boolean  = false;
  status:             string  = "";
  cores:              number  = 0;
  sockets:            number  = 0;
  threads:            number  = 0;
  memory:             string  = "";
  nodeSel:            string  = "";
  instType:           string  = "";
  firmware:           string  = "";
  secureBoot:        boolean  = false;
  vmi:           KubeVirtVMI  = new KubeVirtVMI;
  diskList:         VMDisk[]  = [];
  networkList:   VMNewtork[]  = [];
  priorityClass:      string  = "";
  printableStatus:    string  = "";
}
