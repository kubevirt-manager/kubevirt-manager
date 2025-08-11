# kubevirt-manager.io

**Website:** [kubevirt-manager.io](https://kubevirt-manager.io/)  
**Maintainers:** [feitnomore](https://github.com/feitnomore/)  
**Feedback/Feature Request:** [form](https://forms.gle/dGMmswVYjNGCk2jNA)

Simple Angular Frontend Web UI Interface to operate [Kubevirt](https://kubevirt.io/). This tools lets you perform basic operations around `Virtual Machines`, `Virtual Machine Instances`, `Virtual Machine Pools` and `Disks`. As the tool grew, other features got added like `Load Balancing`, `Auto Scaling`, `Monitoring` and `Cluster API` support. This tool was built initially based on requirements I had for my own environment at home and started growing as needed.  
For a Quick Start, go to our website [https://kubevirt-manager.io/](https://kubevirt-manager.io/)  
  
  If you are using the tool, please help us by providing feedback [here](https://forms.gle/dGMmswVYjNGCk2jNA).

*WARNING:* Use it at your own risk.

## INTRODUCTION

I've created this Frontend for `KubeVirt` while I was trying to learn a little bit of `Angular`. Basically this tool uses `kubectl proxy` to proxy API requests to `kubeapiserver`. To handle the `Disk`/`Volume` part, the tool works through [CDI](https://github.com/kubevirt/containerized-data-importer/). As the time passed by, support for other features like `HPA`, `Services`, `Prometheus` and `Cluster API` were added.  
For a Quick Start, go to our website [https://kubevirt-manager.io/](https://kubevirt-manager.io/) as we provide a [bundled.yaml](kubernetes/bundled.yaml) file that has the basic setup.

## REQUIREMENTS

These are the **minimum** requirements to have the system running.  
Kubevirt featureGate `ExpandDisks` is **required**.

`CDI` is **required** with featureGate `HonorWaitForFirstConsumer` active: 
```
  config:
    featureGates:
    - HonorWaitForFirstConsumer
```

StorageClass feature `allowVolumeExpansion` is **required**:
```
allowVolumeExpansion: true
```

If you are using hostpath-provisioner or any other local node storage, you will need to use `WaitForFirstConsumer`:
```
volumeBindingMode: WaitForFirstConsumer
```

*Note: These settings are required to work with a hostpath csi driver, in order to prevent virtual machine instances from being started in a node different from the node in which the disk/volume resides.*

## HOW TO INSTALL IT

### Create the Namespace
```sh
$ kubectl apply -f kubernetes/ns.yaml
```
### Create the Custom Resource Definition
```sh
$ kubectl apply -f kubernetes/crd.yaml
```
### Create the Service Account and RBAC
```sh
$ kubectl apply -f kubernetes/rbac.yaml
```
### Create the FrontEnd Deployment
```sh
$ kubectl apply -f kubernetes/deployment.yaml
```
### Create the Priority Classes
```sh
$ kubectl apply -f kubernetes/pc.yaml
```
### Create the FrontEnd Service
```sh
kubectl apply -f kubernetes/service.yaml
```

## HOW TO USE IT

The recommended way to use this tool is through an `Ingress` or a `Service`.  
You can also use `kubectl port-forward` on port 8080.

*Note:* As the tool needs Websocket support, if you are using an `Ingress` make sure you set it up accordingly.

## Screenshots

To optimize the load of the main repo README, screenshots were removed from here. To see the screenshots, visit [images](images/) directory.


## Building

To build the tool simply run: 
```sh
docker build -t your-repo/kubevirt-manager:version .
docker push your-repo/kubevirt-manager:version
```

## Building & Running Locally
Please clone noVNC:
```sh
cd src/assets/
git clone https://github.com/novnc/noVNC.git
```
To build the tool run:
```sh
npm install
ng build
```
To run the tool:
```sh
kubectl proxy --www=./dist/kubevirtmgr-webui/browser/ --accept-hosts=^.*$ --address=[::] --api-prefix=/k8s/ --www-prefix=
```
Access the tool at: http://localhost:8001/

*Note:* Make sure your `kubectl` is pointing to the right cluster.   
*Note:* Make sure the account your `kubectl` is using has correct RBAC.  
*Note:* This method doesn't like `websocket` VNC.    
*Note:* This method doesn't support `Prometheus` integration.   
*Note:* This method doesn't support `NGINX basic_auth`.  

## Testing
The tests implemented are pretty simple so far. To run the tests, simply execure:
```sh
npm test
```


## References

01. [kubevirt-manager.io](https://kubevirt-manager.io/)
02. [Kubernetes](https://kubernetes.io/)
03. [Kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/)
04. [CDI](https://github.com/kubevirt/containerized-data-importer/)
05. [KubeVirt](https://kubevirt.io)
06. [NodeJS](https://nodejs.org/en/)
07. [Angular](https://angular.io/)
08. [AdminLTE](https://adminlte.io/)
09. [NoVNC](https://github.com/novnc/noVNC)
10. [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
11. [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
12. [KubeVirt Monitoring](https://kubevirt.io/user-guide/operations/component_monitoring/)
13. [NGINX basic_auth](http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
14. [Kubernetes Cluster API Provider for Kubevirt](https://github.com/kubernetes-sigs/cluster-api-provider-kubevirt)
15. [Cluster API Quick Start](https://cluster-api.sigs.k8s.io/user/quick-start.html)
16. [ClusterResourceSet](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-resource-set.html)
17. [image-builder](https://github.com/kubernetes-sigs/image-builder)
18. [capk-versions.json](https://kubevirt-manager.online/capk-versions.json)
19. [cni-versions.json](https://kubevirt-manager.online/cni-versions.json)
20. [features.json](https://kubevirt-manager.online/features.json)

## License

**kubevirt-manager.io** is licensed under the [Apache Licence, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
