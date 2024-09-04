export class FirewallLabels {
    VirtualMachine:       string = "fw.kubevirt-manager.io/vm-name";
    VirtualMachinePool:   string = "fw.kubevirt-manager.io/pool-name";
    Cluster:              string = "fw.kubevirt-manager.io/cluster-name";
    ClusterMasterPool:    string = "fw.kubevirt-manager.io/master-name";
    ClusterWorkerPool:    string = "fw.kubevirt-manager.io/worker-name";
    namespaceSelector:    string = "kubernetes.io/metadata.name";
}