import { KClusterFeatues } from "./kcluster-featues.model";
import { KClusterKubeadmControlPlane } from "./kcluster-kubeadm-control-plane.model";
import { KClusterMachineDeployment } from "./kcluster-machine-deployment.model";
import { LoadBalancer } from "./load-balancer.model";

export class KCluster {
    name:                                      string  = "";
    namespace:                                 string  = "";
    labels:                                         {} =  {};
    creationTimestamp:                           Date  = new Date;
    podCidrs:                                  string  = "";
    svcCidrs:                                  string  = "";
    cpHost:                                    string  = "";
    cpPort:                                    string  = "";
    cpName:                                    string  = "";
    cpNamespace:                               string  = "";
    infName:                                   string  = "";
    infNamespace:                              string  = "";
    cniPlugin:                                 string  = "";
    cniPluginVersion:                          string  = "";
    cniVXLANPort:                              string  = "";
    clusterAutoscaler:                        boolean  = false;
    workerPools:                               number  = 0;
    totalWorkers:                              number  = 0;
    controlPlaneReady:                        boolean  = false;
    infrastructureReady:                      boolean  = false;
    machineDeployments:   KClusterMachineDeployment[]  = [];
    controlPlane:         KClusterKubeadmControlPlane  = new KClusterKubeadmControlPlane;
    features:                         KClusterFeatues  = new KClusterFeatues;
    loadBalancerList:                  LoadBalancer[]  = [];
}
