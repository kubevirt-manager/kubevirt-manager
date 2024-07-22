export class KubeVirtVMI {
  name:               string   = "";
  namespace:          string   = "";
  uid:                string   = "";
  running:           boolean   = false;
  labels:                 {}   = {};
  creationTimestamp:    Date   = new Date;
  osId:               string   = "";
  osKernRel:          string   = "";
  osKernVer:          string   = "";
  osName:             string   = "";
  osPrettyName:       string   = "";
  osVersion:          string   = "";
  ifAddr:             string   = "";
  ifName:             string   = "";
  nodeName:           string   = "";
}
