import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { lastValueFrom } from 'rxjs';
import { KClusterKubeadmControlPlane } from 'src/app/models/kcluster-kubeadm-control-plane.model';
import { KClusterKubevirtMachineTemplate } from 'src/app/models/kcluster-kubevirt-machine-template.model';
import { KClusterMachineDeployment } from 'src/app/models/kcluster-machine-deployment.model';
import { KCluster } from 'src/app/models/kcluster.model';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { K8sService } from 'src/app/services/k8s.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { KubevirtMgrCapk } from 'src/app/services/kubevirt-mgr-capk.service';
import { XK8sService } from 'src/app/services/x-k8s.service';
import { DataVolume } from 'src/app/templates/data-volume.apitemplate';
import { KClusterTemplate } from 'src/app/templates/k-cluster.apitemplate';

@Component({
  selector: 'app-kcluster',
  templateUrl: './kcluster.component.html',
  styleUrls: ['./kcluster.component.css']
})
export class KClusterComponent implements OnInit {

    clusterList: KCluster[] = [];
    clusterImageList: any;
    cniList: any;
    featureList: any;
    charDot = '.';

    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private router: Router,
        private kubevirtMgrCapk: KubevirtMgrCapk,
        private k8sService: K8sService,
        private k8sApisService: K8sApisService,
        private kubeVirtService: KubeVirtService,
        private xK8sService: XK8sService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getClusters();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Kubernetes Clusters");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Load Image List for Cluster
     */
    async loadClusterImages(): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubevirtMgrCapk.loadImages());
            this.clusterImageList = data;
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Load Image List for Cluster
     */
    async loadCNIList(): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubevirtMgrCapk.loadCNIs());
            this.cniList = data;
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Load Feature List for Cluster
     */
    async loadFeatureList(): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubevirtMgrCapk.loadFeatures());
            this.featureList = data;
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Load Cluster List
     */
     async getClusters(): Promise<void> {
        const data = await lastValueFrom(this.xK8sService.getClusters());
        let clusters = data.items;
        for(let i = 0; i < clusters.length; i++) {
            let thisCluster = new KCluster();
            thisCluster.name = clusters[i].metadata.name;
            thisCluster.namespace = clusters[i].metadata.namespace;
            thisCluster.cpHost = clusters[i].spec.controlPlaneEndpoint.host;
            thisCluster.cpPort = clusters[i].spec.controlPlaneEndpoint.port;
            thisCluster.cpName = clusters[i].spec.controlPlaneRef.name;
            thisCluster.cpNamespace = clusters[i].spec.controlPlaneRef.namespace;
            thisCluster.infName = clusters[i].spec.infrastructureRef.name;
            thisCluster.infNamespace = clusters[i].spec.infrastructureRef.namespace;
            for(let j = 0; j < clusters[i].spec.clusterNetwork.pods.cidrBlocks.length; j++) {
                thisCluster.podCidrs += clusters[i].spec.clusterNetwork.pods.cidrBlocks[j];
            }
            for(let j = 0; j < clusters[i].spec.clusterNetwork.services.cidrBlocks.length; j++) {
                thisCluster.svcCidrs += clusters[i].spec.clusterNetwork.services.cidrBlocks[j];
            }
            try {
                if(clusters[i].status.controlPlaneReady != null) {
                    thisCluster.controlPlaneReady = clusters[i].status.controlPlaneReady;
                } else {
                    thisCluster.controlPlaneReady = false;
                }
            } catch (e) {
                thisCluster.controlPlaneReady = false;
            }
            try {
                if (clusters[i].status.infrastructureReady != null) {
                    thisCluster.infrastructureReady = clusters[i].status.infrastructureReady;
                } else {
                    thisCluster.infrastructureReady = false;
                }
            } catch (e: any) {
                thisCluster.infrastructureReady = false;
                console.log(e);
            }

            /* Loading MachineDeployments information */
            let data = await lastValueFrom(this.xK8sService.getClusterMachineDeployments(thisCluster.namespace, thisCluster.name));
            let workerpools = data.items;
            for(let j = 0; j < workerpools.length; j++) {
                thisCluster.totalWorkers += workerpools[j].spec.replicas;
                let thisWorker = workerpools[j];
                let thisWorkerPool = new KClusterMachineDeployment();
                thisWorkerPool.name = thisWorker.metadata.name;
                thisWorkerPool.namespace = thisWorker.metadata.namespace;
                thisWorkerPool.clusterName = thisWorker.spec.clusterName;
                thisWorkerPool.replicas = thisWorker.spec.replicas;
                thisWorkerPool.version = thisWorker.spec.template.spec.version;
                let workertemplate = await lastValueFrom(this.xK8sService.getKubevirtMachineTemplate(thisWorker.spec.template.spec.infrastructureRef.namespace, thisWorker.spec.template.spec.infrastructureRef.name));
                let thisWorkerTemplate = new KClusterKubevirtMachineTemplate;
                thisWorkerTemplate.name = workertemplate.metadata.name;
                thisWorkerTemplate.namespace = workertemplate.metadata.namespace;
                try {
                    thisWorkerTemplate.clusterName = workertemplate.metadata.ownerReferences[0].name;
                } catch (e: any) {
                    thisWorkerTemplate.clusterName = "N/A";
                    console.log(e);
                }
                thisWorkerPool.machineTemplate = thisWorkerTemplate;
                thisCluster.machineDeployments.push(thisWorkerPool);
                thisCluster.workerPools += 1;
            }

            /* Loading Control Plane information */
            data = await lastValueFrom(this.xK8sService.getClusterControlPlane(thisCluster.namespace, thisCluster.cpName));
            let thisControlPlane = new KClusterKubeadmControlPlane();
            thisControlPlane.name = data.metadata.name;
            thisControlPlane.namespace = data.metadata.namespace;
            try {
                thisControlPlane.clusterName = data.metadata.ownerReferences[0].name;
            } catch (e: any) {
                thisControlPlane.clusterName = "N/A";
                console.log(e);
            }
            thisControlPlane.dnsDomain = data.spec.kubeadmConfigSpec.clusterConfiguration.networking.dnsDomain;
            thisControlPlane.podSubnet = data.spec.kubeadmConfigSpec.clusterConfiguration.networking.podSubnet;
            thisControlPlane.serviceSubnet = data.spec.kubeadmConfigSpec.clusterConfiguration.networking.serviceSubnet;
            thisControlPlane.replicas = data.spec.replicas;
            thisControlPlane.version = data.spec.version;
            try {
                thisControlPlane.initialized = data.status.initialized;
            } catch (e: any) {
                thisControlPlane.initialized = false;
                console.log(e);
            }
            try {
                thisControlPlane.ready = data.status.ready;
            } catch (e: any) {
                thisControlPlane.ready = false;
                console.log(e);
            }
            let cptemplate = await lastValueFrom(this.xK8sService.getKubevirtMachineTemplate(data.spec.machineTemplate.infrastructureRef.namespace, data.spec.machineTemplate.infrastructureRef.name));
            let thisCPTemplate = new KClusterKubevirtMachineTemplate;
            thisCPTemplate.name = cptemplate.metadata.name;
            thisCPTemplate.namespace = cptemplate.metadata.namespace;
            try {
                thisCPTemplate.clusterName = cptemplate.metadata.ownerReferences[0].name;
            } catch (e: any) {
                thisCPTemplate.clusterName = "N/A";
                console.log(e);
            }
            thisControlPlane.machineTemplate = thisCPTemplate;
            thisCluster.controlPlane = thisControlPlane;
            this.clusterList.push(thisCluster);
        }
    }

    /*
     * Generate Kubeconfig
     */
    async getKubeconfig(namespace: string, name: string): Promise<void> {
        try {
            const data = await lastValueFrom(this.xK8sService.getClusterKubeconfig(namespace, name));
            let base64data = data.data.value;
            const src = `data:text/yaml;base64,${base64data}`;
            const link = document.createElement("a");
            link.href = src;
            link.download = namespace + "-" + name + "-kubeconfig";
            link.click();
            link.remove();
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Download SSH Key (capk user)
     */
    async getSSHKey(namespace: string, name: string): Promise<void> {
        try {
            let data = await lastValueFrom(this.xK8sService.getClusterSSHKey(namespace, name));
            let base64data = data.data.key;
            const src = `data:application/x-pem-file;base64,${base64data}`;
            const link = document.createElement("a");
            link.href = src;
            link.download = namespace + "-" + name + "-ssh.pem";
            link.click();
            link.remove();
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Show New Window
     */
    showNew(): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-new");
        let modalTitle = document.getElementById("new-title");
        let modalBody = document.getElementById("new-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Kubernetes Cluster");
        }
        
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Show Delete Window
     */
    showDelete(namespace: string, name: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let clusterNameInput = document.getElementById("delete-name");
            let clusterNamespaceInput = document.getElementById("delete-namespace");
            if(clusterNameInput != null && clusterNamespaceInput != null) {
                clusterNameInput.setAttribute("value", name);
                clusterNamespaceInput.setAttribute("value", namespace);
                modalBody.replaceChildren("Are you sure you want to delete cluster " + name + " on namespace: " + namespace + "?");
            }
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }
    }

    /*
     * Delete Cluster
     */
    async applyDelete(): Promise<void> {
        let clusterNameInput = document.getElementById("delete-name");
        let clusterNamespaceInput = document.getElementById("delete-namespace");
        if(clusterNameInput != null && clusterNamespaceInput != null) {
            let clusterName = clusterNameInput.getAttribute("value");
            let clusterNamespace = clusterNamespaceInput.getAttribute("value");
            if(clusterName != null && clusterNamespace != null) {
                try {
                    let configData = await lastValueFrom(this.xK8sService.deleteConfigSecret(clusterNamespace, clusterName + "-config"));
                } catch (e: any) {
                    console.log(e);
                }
                try {
                    let controllerData = await lastValueFrom(this.xK8sService.getKCCServices(clusterNamespace, clusterName));
                    for (let i = 0; i < controllerData.items.length; i++) {
                        try {
                            let deleteService = await lastValueFrom(this.xK8sService.deleteKCCServices(controllerData.items[i].metadata.namespace, controllerData.items[i].metadata.name));
                        } catch (e: any) {
                            console.log(e);
                        }
                    }                    
                } catch (e: any) {
                    console.log(e);
                }
                try {
                    let kccConfig = await lastValueFrom(this.xK8sService.deleteKCCConfigMap(clusterNamespace, clusterName + "-kcc"));
                } catch (e: any) {
                    console.log(e);
                }
                try {
                    let resourceSet = await lastValueFrom(this.xK8sService.deleteClusterResourseSet(clusterNamespace, clusterName));
                } catch (e: any) {
                    console.log(e);
                }
                try {
                    let clusterData = await lastValueFrom(this.xK8sService.deleteCluster(clusterNamespace, clusterName));
                    this.hideComponent("modal-delete");
                    this.reloadComponent();
                } catch (e: any) {
                    console.log(e);
                    alert(e.error.message);
                }
            }
        }
    }

    /*
     * Show New Cluster Window
     */
    async showNewCluster(): Promise<void> {
        this.hideComponent("modal-new");
        clearInterval(this.myInterval);
        let i = 0;
        let modalDiv = document.getElementById("modal-newcluster");
        let modalTitle = document.getElementById("newcluster-title");
        let modalBody = document.getElementById("newcluster-value");

        let selectorNamespacesField = document.getElementById("newcluster-namespace");
        let selectorKubernetesVersionField = document.getElementById("newcluster-version");
        let selectorCNIField = document.getElementById("newcluster-cni");

        let selectorCPTypeField = document.getElementById("newcluster-controlplane-type");
        let selectorNPTypeField = document.getElementById("newcluster-nodepool-type");

        let selectorCPPCField = document.getElementById("newcluster-controlplane-pc");
        let selectorNPPCField = document.getElementById("newcluster-nodepool-pc");

        let selectorCPSCField = document.getElementById("newcluster-controlplane-disksc");
        let selectorNPSCField = document.getElementById("newcluster-nodepool-disksc");

        /* Load Namespace List and Set Selector */
        let data = await lastValueFrom(this.k8sService.getNamespaces());
        let nsSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        /* Show window before loading the rest 
         * to avoid delays
         */
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Kubernetes Cluster");
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }

        /* Load Kubernetes Versions on Selector */
        await this.loadClusterImages();
        let kubernetesVersionSelectorOptions = "<option value=none></option>";
        for (i = 0; i < this.clusterImageList.versions.length; i++) {
            kubernetesVersionSelectorOptions += "<option value=" + this.clusterImageList.versions[i].id +">" + this.clusterImageList.versions[i].name + "</option>\n";
        }
        if (selectorKubernetesVersionField != null) {
            selectorKubernetesVersionField.innerHTML = kubernetesVersionSelectorOptions;
        }

        /* Load CNIs on Selector */
        await this.loadCNIList();
        let kubernetesCNISelectorOptions = "<option value=manual>manual</option>\n";
        for (i = 0; i < this.cniList.cnis.length; i++) {
            kubernetesCNISelectorOptions += "<option value=" + this.cniList.cnis[i].id +">" + this.cniList.cnis[i].name + "</option>\n";
        }
        if (selectorCNIField != null) {
            selectorCNIField.innerHTML = kubernetesCNISelectorOptions;
        }

        /* Load ClusterInstanceType List and Set Selector */
        data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        let typeSelectorOptions = "<option value=none></option>";
        for (i = 0; i < data.items.length; i++) {
            typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorCPTypeField != null && selectorNPTypeField != null) {
            typeSelectorOptions += "<option value=custom>custom</option>\n";
            selectorCPTypeField.innerHTML = typeSelectorOptions;
            selectorNPTypeField.innerHTML = typeSelectorOptions;
        }

        /* Load Storage Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getStorageClasses());
        let storageSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            storageSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorCPSCField != null && selectorNPSCField != null) {
            selectorCPSCField.innerHTML = storageSelectorOptions;
            selectorNPSCField.innerHTML = storageSelectorOptions;
        }

        /* Load Priority Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
        let prioritySelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            if(data.items[i].metadata["name"].toLowerCase() == "vm-standard") {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +" selected>" + data.items[i].metadata["name"] + "</option>\n";
            } else {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        }
        if (selectorCPPCField != null && selectorNPPCField != null) {
            selectorCPPCField.innerHTML = prioritySelectorOptions;
            selectorNPPCField.innerHTML = prioritySelectorOptions;
        }

        await this.loadFeatureList();

    }

    /*
     * Show New Cluster Window
     */
    async showNewClusterCustom(): Promise<void> {
        this.hideComponent("modal-new");
        clearInterval(this.myInterval);
        let i = 0;
        let modalDiv = document.getElementById("modal-newclustercustom");
        let modalTitle = document.getElementById("newclustercustom-title");
        let modalBody = document.getElementById("newclustercustom-value");

        let selectorNamespacesField = document.getElementById("newclustercustom-namespace");
        let selectorCPTypeField = document.getElementById("newclustercustom-controlplane-type");
        let selectorNPTypeField = document.getElementById("newclustercustom-nodepool-type");

        let selectorCPPCField = document.getElementById("newclustercustom-controlplane-pc");
        let selectorNPPCField = document.getElementById("newclustercustom-nodepool-pc");

        let selectorCPSCField = document.getElementById("newclustercustom-controlplane-disksc");
        let selectorNPSCField = document.getElementById("newclustercustom-nodepool-disksc");

        /* Load Namespace List and Set Selector */
        let data = await lastValueFrom(this.k8sService.getNamespaces());
        let nsSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        /* Show window before loading the rest 
         * to avoid delays
         */
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Kubernetes Cluster");
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }

        /* Load ClusterInstanceType List and Set Selector */
        data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        let typeSelectorOptions = "<option value=none></option>";
        for (i = 0; i < data.items.length; i++) {
            typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorCPTypeField != null && selectorNPTypeField != null) {
            typeSelectorOptions += "<option value=custom>custom</option>\n";
            selectorCPTypeField.innerHTML = typeSelectorOptions;
            selectorNPTypeField.innerHTML = typeSelectorOptions;
        }

        /* Load Storage Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getStorageClasses());
        let storageSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            storageSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorCPSCField != null && selectorNPSCField != null) {
            selectorCPSCField.innerHTML = storageSelectorOptions;
            selectorNPSCField.innerHTML = storageSelectorOptions;
        }

        /* Load Priority Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
        let prioritySelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            if(data.items[i].metadata["name"].toLowerCase() == "vm-standard") {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +" selected>" + data.items[i].metadata["name"] + "</option>\n";
            } else {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        }
        if (selectorCPPCField != null && selectorNPPCField != null) {
            selectorCPPCField.innerHTML = prioritySelectorOptions;
            selectorNPPCField.innerHTML = prioritySelectorOptions;
        }

    }

    /*
     * Create new Standard Cluster
     */
    async applyNewCluster(
        clustername: string,
        clusternamespace: string,
        clusterlabelkeyone: string,
        clusterlabelvalueone: string,
        clusterlabelkeytwo: string,
        clusterlabelvaluetwo: string,
        clusterlabelkeythree: string,
        clusterlabelvaluethree: string,
        clusterversion: string,
        clustercni: string,
        clustercniversion: string,
        clusterdns: string,
        clusterpodcidr: string,
        clustersvccidr: string,
        clusternetwork: string,
        clusternetworktype: string,
        clustercontrolplaneeptype: string,
        clustercontrolplaneepannotationskeyone: string,
        clustercontrolplaneepannotationsvalueone: string,
        clustercontrolplaneepannotationskeytwo: string,
        clustercontrolplaneepannotationsvaluetwo: string,
        clustercontrolplaneosdist: string,
        clustercontrolplaneosversion: string,
        clustercontrolplanetype: string,
        clustercontrolplanecpumemsockets: string,
        clustercontrolplanecpumemcores: string,
        clustercontrolplanecpumemthreads: string,
        clustercontrolplanecpumemmemory: string,
        clustercontrolplanepc: string,
        clustercontrolplanereplicas: string,
        clustercontrolplanedisksize: string,
        clustercontrolplanedisksc: string,
        clustercontrolplanediskam: string,
        clustercontrolplanediskcm: string,
        clusternodepoolname: string,
        clusternodepoolosdist: string,
        clusternodepoolosversion: string,
        clusternodepooltype: string,
        clusternodepoolcpumemsockets: string,
        clusternodepoolcpumemcores: string,
        clusternodepoolcpumemthreads: string,
        clusternodepoolcpumemmemory: string,
        clusternodepoolpc: string,
        clusternodepoolreplicas: string,
        clusternodepooldisksize: string,
        clusternodepooldisksc: string,
        clusternodepooldiskam: string,
        clusternodepooldiskcm: string,
        clusterfeaturescertmanager: boolean,
        clusterfeaturesdashboard: boolean,
        clusterfeaturesmetrics: boolean,
        clusterfeatureshaproxyingress: boolean,
        clusterfeaturesnginxingress: boolean,
        clusterfeaturestekton: boolean
    ) {

        /* Loading control plane data needed for validation */
        let controlPlaneTypedCpus = 0;
        if(clustercontrolplanetype != "custom" && clustercontrolplanetype != "")
        {
            try {
                const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(clustercontrolplanetype));
                controlPlaneTypedCpus = Number(data.spec.cpu["guest"]);
            } catch (e: any) {
                console.log(e);
            }
        }

        /*
         * Basic Field Validation
         */
        if(clustername == "" || clusternamespace == "") {
            alert("You need to fill in the name and namespace fields!");
        } else if(clustername.includes(this.charDot)) {
            alert("Your cluster name should not have . (dot) character!");
        } else if ((clustercni != "" && clustercni.toLowerCase() != "none" && clustercni.toLowerCase() != "manual") && (clustercniversion == "" || clustercniversion.toLowerCase() == "none")) {
            alert("Your must select a CNI version for" + clustercni + "!");
        } else if (clusterdns == "") {
            alert("Cluster DNS should not be empty");
        } else if (clustercontrolplaneosdist == "none" || clustercontrolplaneosdist == "") {
            alert("Choose an Operating System for your Control Plane!");
        } else if (clusterversion == "" || clusterversion.toLowerCase() == "none") {
            alert("You need to select a Kubernetes Version for you cluster!");
        } else if (clustercontrolplaneeptype == "" || clustercontrolplaneeptype.toLowerCase() == "none") {
            alert("Please select an Endpoint Type for you Kubernetes API!");
        } else if(this.checkClusterExists(clustername, clusternamespace)) {
            alert("Cluster with name/namespace combination already exists!");
        } else if(clustercontrolplanetype.toLowerCase() == "none" || clustercontrolplanetype.toLowerCase() == "") {
            alert("Please select a valid VM Type for Control Plane!");
        } else if(clusternodepooltype.toLowerCase() == "none" || clusternodepooltype.toLowerCase() == "") {
            alert("Please select a valid VM Type for Node Pool!");
        } else if(Number(clustercontrolplanereplicas)%2 == 0 || Number(clustercontrolplanereplicas) == 0 || clustercontrolplanereplicas == "") {
            alert("Control Plane replicas number needs to be an odd number!");
        } else if(clustercontrolplanedisksize == "") {
            alert("Check Control Plane disk size!");
        } else if(clusternodepoolosdist == "none" || clusternodepoolosdist == "") {
            alert("Choose an Operating System for your Node Pool!");
        } else if(clusternodepooldisksize == "") {
            alert("Check Node Pool disk size!");
        } else if(Number(clusternodepoolreplicas) == 0 || clusternodepoolreplicas == "") {
            alert("Please check your Node Pool replicas number!");
        } else if((clustercontrolplanetype.toLowerCase() == "custom") && (clustercontrolplanecpumemsockets == "" || clustercontrolplanecpumemcores == "" || clustercontrolplanecpumemthreads == "" || clustercontrolplanecpumemmemory == "")) {
            alert("To use Control Plane with Custom Type, you must fill in all CPU and Memory fields!");
        } else if((clusternodepooltype.toLowerCase() == "custom") && (clusternodepoolcpumemsockets == "" || clusternodepoolcpumemcores == "" || clusternodepoolcpumemthreads == "" || clusternodepoolcpumemmemory == "")) {
            alert("To use Node Pool with Custom Type, you must fill in all CPU and Memory fields!");
        } else if((clustercontrolplanetype == "custom") && ((Number(clustercontrolplanecpumemcores) * Number(clustercontrolplanecpumemsockets) * Number(clustercontrolplanecpumemthreads)) < 2 )) {
            alert("Control Plane machines needs at least 2 vCPU!");
        } else if(clustercontrolplanetype != "custom" && controlPlaneTypedCpus < 2) {
            alert("Control Plane machines needs at least 2 vCPU, choose a bigger VM Type!");
        } else {

            /* Auto Fill CIDR Blocks */
            if(clusterpodcidr == "") {
                clusterpodcidr = "10.243.0.0/16";
            }
            if(clustersvccidr == "") {
                clustersvccidr = "10.95.0.0/16";
            }

            let clustercontrolplaneimageurl = this.getImageUrl(clusterversion, clustercontrolplaneosdist, clustercontrolplaneosversion);
            let clusternodepoolimageurl = this.getImageUrl(clusterversion, clusternodepoolosdist, clusternodepoolosversion);

            /* Generate random VXLAN Port */
            let clustercnivxlanport = "";
            if (clustercni != "manual") {
                clustercnivxlanport = this.generateVXLANPort().toString();
            }

            /* Create Cluster Related Objects */
            try {
                this.createClusterRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterlabelkeyone,
                                            clusterlabelvalueone,
                                            clusterlabelkeytwo,
                                            clusterlabelvaluetwo,
                                            clusterlabelkeythree,
                                            clusterlabelvaluethree,
                                            clustercni,
                                            clustercniversion,
                                            clustercnivxlanport,
                                            clusterpodcidr,
                                            clustersvccidr,
                                            clustercontrolplaneeptype,
                                            clustercontrolplaneepannotationskeyone,
                                            clustercontrolplaneepannotationsvalueone,
                                            clustercontrolplaneepannotationskeytwo,
                                            clustercontrolplaneepannotationsvaluetwo);

                this.createControlPlaneRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterversion,
                                            clusterdns,
                                            clusterpodcidr,
                                            clustersvccidr,
                                            clusternetwork,
                                            clusternetworktype,
                                            clustercontrolplaneosdist,
                                            clustercontrolplaneosversion,
                                            clustercontrolplaneimageurl,
                                            clustercontrolplanetype,
                                            clustercontrolplanecpumemsockets,
                                            clustercontrolplanecpumemcores,
                                            clustercontrolplanecpumemthreads,
                                            clustercontrolplanecpumemmemory,
                                            clustercontrolplanepc,
                                            clustercontrolplanereplicas,
                                            clustercontrolplanedisksize,
                                            clustercontrolplanedisksc,
                                            clustercontrolplanediskam,
                                            clustercontrolplanediskcm);

                this.createNodePoolRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterversion,
                                            clusternetwork,
                                            clusternetworktype,
                                            clusternodepoolname,
                                            clusternodepoolosdist,
                                            clusternodepoolosversion,
                                            clusternodepoolimageurl,
                                            clusternodepooltype,
                                            clusternodepoolcpumemsockets,
                                            clusternodepoolcpumemcores,
                                            clusternodepoolcpumemthreads,
                                            clusternodepoolcpumemmemory,
                                            clusternodepoolpc,
                                            clusternodepoolreplicas,
                                            clusternodepooldisksize,
                                            clusternodepooldisksc,
                                            clusternodepooldiskam,
                                            clusternodepooldiskcm);

                this.loadCNIandFeaturesIntoCluster(clustername,
                                                   clusternamespace,
                                                   clustercni,
                                                   clustercniversion,
                                                   clustercnivxlanport,
                                                   clusterpodcidr,
                                                   clusterfeaturescertmanager,
                                                   clusterfeaturesdashboard,
                                                   clusterfeaturesmetrics,
                                                   clusterfeatureshaproxyingress,
                                                   clusterfeaturesnginxingress,
                                                   clusterfeaturestekton);

                this.loadKubevirtCloudControllerManager(clusternamespace, clustername);

                this.hideComponent("modal-newcluster");
                this.reloadComponent();
            } catch (e: any) {
                console.log(e);
                alert(e.error.message);
            }
        }

    }

    /*
     * Create new Standard Cluster
     */
    async applyNewClusterCustom(
        clustername: string,
        clusternamespace: string,
        clusterlabelkeyone: string,
        clusterlabelvalueone: string,
        clusterlabelkeytwo: string,
        clusterlabelvaluetwo: string,
        clusterlabelkeythree: string,
        clusterlabelvaluethree: string,
        clusterversion: string,
        clusterdns: string,
        clusterpodcidr: string,
        clustersvccidr: string,
        clusternetwork: string,
        clusternetworktype: string,
        clustercontrolplaneeptype: string,
        clustercontrolplaneepannotationskeyone: string,
        clustercontrolplaneepannotationsvalueone: string,
        clustercontrolplaneepannotationskeytwo: string,
        clustercontrolplaneepannotationsvaluetwo: string,
        clustercontrolplanetype: string,
        clustercontrolplanecpumemsockets: string,
        clustercontrolplanecpumemcores: string,
        clustercontrolplanecpumemthreads: string,
        clustercontrolplanecpumemmemory: string,
        clustercontrolplanepc: string,
        clustercontrolplanereplicas: string,
        clustercontrolplaneimageurl: string,
        clustercontrolplanedisksize: string,
        clustercontrolplanedisksc: string,
        clustercontrolplanediskam: string,
        clustercontrolplanediskcm: string,
        clusternodepoolname: string,
        clusternodepooltype: string,
        clusternodepoolcpumemsockets: string,
        clusternodepoolcpumemcores: string,
        clusternodepoolcpumemthreads: string,
        clusternodepoolcpumemmemory: string,
        clusternodepoolpc: string,
        clusternodepoolreplicas: string,
        clusternodepoolimageurl: string,
        clusternodepooldisksize: string,
        clusternodepooldisksc: string,
        clusternodepooldiskam: string,
        clusternodepooldiskcm: string
    ) {

        /* Loading control plane data needed for validation */
        let controlPlaneTypedCpus = 0;
        if(clustercontrolplanetype != "custom" && clustercontrolplanetype != "")
        {
            try {
                const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(clustercontrolplanetype));
                controlPlaneTypedCpus = Number(data.spec.cpu["guest"]);
            } catch (e: any) {
                console.log(e);
            }
        }

        /*
         * Basic Field Validation
         */
        if(clustername == "" || clusternamespace == "") {
            alert("You need to fill in the name and namespace fields!");
        } else if(clustername.includes(this.charDot)) {
            alert("Your cluster name should not have . (dot) character!");
        } else if (clusterdns == "") {
            alert("Cluster DNS should not be empty");
        } else if (clustercontrolplaneimageurl == "") {
            alert("You must enter an URL for Control Plane Disk!");
        } else if (!clustercontrolplaneimageurl.startsWith("http")) {
            alert("Control Plane Disk URL must start with http or https");
        } else if (clusterversion == "" || clusterversion.toLowerCase() == "none") {
            alert("You need to select a Kubernetes Version for you cluster!");
        } else if (clustercontrolplaneeptype == "" || clustercontrolplaneeptype.toLowerCase() == "none") {
            alert("Please select an Endpoint Type for you Kubernetes API!");
        } else if(this.checkClusterExists(clustername, clusternamespace)) {
            alert("Cluster with name/namespace combination already exists!");
        } else if(clustercontrolplanetype.toLowerCase() == "none" || clustercontrolplanetype.toLowerCase() == "") {
            alert("Please select a valid VM Type for Control Plane!");
        } else if(clusternodepooltype.toLowerCase() == "none" || clusternodepooltype.toLowerCase() == "") {
            alert("Please select a valid VM Type for Node Pool!");
        } else if(Number(clustercontrolplanereplicas)%2 == 0 || Number(clustercontrolplanereplicas) == 0 || clustercontrolplanereplicas == "") {
            alert("Control Plane replicas number needs to be an odd number!");
        } else if(clustercontrolplanedisksize == "") {
            alert("Check Control Plane disk size!");
        } else if (clusternodepoolimageurl == "") {
            alert("You must enter an URL for Node Pool Disk!");
        } else if (!clusternodepoolimageurl.startsWith("http")) {
            alert("Node Pool Disk URL must start with http or https");
        } else if(clusternodepooldisksize == "") {
            alert("Check Node Pool disk size!");
        } else if(Number(clusternodepoolreplicas) == 0 || clusternodepoolreplicas == "") {
            alert("Please check your Node Pool replicas number!");
        } else if((clustercontrolplanetype.toLowerCase() == "custom") && (clustercontrolplanecpumemsockets == "" || clustercontrolplanecpumemcores == "" || clustercontrolplanecpumemthreads == "" || clustercontrolplanecpumemmemory == "")) {
            alert("To use Control Plane with Custom Type, you must fill in all CPU and Memory fields!");
        } else if((clusternodepooltype.toLowerCase() == "custom") && (clusternodepoolcpumemsockets == "" || clusternodepoolcpumemcores == "" || clusternodepoolcpumemthreads == "" || clusternodepoolcpumemmemory == "")) {
            alert("To use Node Pool with Custom Type, you must fill in all CPU and Memory fields!");
        } else if((clustercontrolplanetype == "custom") && ((Number(clustercontrolplanecpumemcores) * Number(clustercontrolplanecpumemsockets) * Number(clustercontrolplanecpumemthreads)) < 2 )) {
            alert("Control Plane machines needs at least 2 vCPU!");
        } else if(clustercontrolplanetype != "custom" && controlPlaneTypedCpus < 2) {
            alert("Control Plane machines needs at least 2 vCPU, choose a bigger VM Type!");
        } else {

            /* Auto Fill CIDR Blocks */
            if(clusterpodcidr == "") {
                clusterpodcidr = "10.243.0.0/16";
            }
            if(clustersvccidr == "") {
                clustersvccidr = "10.95.0.0/16";
            }

            let clustercontrolplaneosdist = "custom";
            let clustercontrolplaneosversion = "custom";
            let clusternodepoolosdist = "custom";
            let clusternodepoolosversion = "custom";

            /* Generate random VXLAN Port */
            let clustercnivxlanport = "0000";
            let clustercni = "manual";
            let clustercniversion = "manual";

            /* Create Cluster Related Objects */
            try {
                this.createClusterRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterlabelkeyone,
                                            clusterlabelvalueone,
                                            clusterlabelkeytwo,
                                            clusterlabelvaluetwo,
                                            clusterlabelkeythree,
                                            clusterlabelvaluethree,
                                            clustercni,
                                            clustercniversion,
                                            clustercnivxlanport,
                                            clusterpodcidr,
                                            clustersvccidr,
                                            clustercontrolplaneeptype,
                                            clustercontrolplaneepannotationskeyone,
                                            clustercontrolplaneepannotationsvalueone,
                                            clustercontrolplaneepannotationskeytwo,
                                            clustercontrolplaneepannotationsvaluetwo);

                this.createControlPlaneRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterversion,
                                            clusterdns,
                                            clusterpodcidr,
                                            clustersvccidr,
                                            clusternetwork,
                                            clusternetworktype,
                                            clustercontrolplaneosdist,
                                            clustercontrolplaneosversion,
                                            clustercontrolplaneimageurl,
                                            clustercontrolplanetype,
                                            clustercontrolplanecpumemsockets,
                                            clustercontrolplanecpumemcores,
                                            clustercontrolplanecpumemthreads,
                                            clustercontrolplanecpumemmemory,
                                            clustercontrolplanepc,
                                            clustercontrolplanereplicas,
                                            clustercontrolplanedisksize,
                                            clustercontrolplanedisksc,
                                            clustercontrolplanediskam,
                                            clustercontrolplanediskcm);

                this.createNodePoolRelatedObjects(clustername,
                                            clusternamespace,
                                            clusterversion,
                                            clusternetwork,
                                            clusternetworktype,
                                            clusternodepoolname,
                                            clusternodepoolosdist,
                                            clusternodepoolosversion,
                                            clusternodepoolimageurl,
                                            clusternodepooltype,
                                            clusternodepoolcpumemsockets,
                                            clusternodepoolcpumemcores,
                                            clusternodepoolcpumemthreads,
                                            clusternodepoolcpumemmemory,
                                            clusternodepoolpc,
                                            clusternodepoolreplicas,
                                            clusternodepooldisksize,
                                            clusternodepooldisksc,
                                            clusternodepooldiskam,
                                            clusternodepooldiskcm);

                /* Custom cluster doesn't support CNI and Features so far */

                this.loadKubevirtCloudControllerManager(clusternamespace, clustername);

                this.hideComponent("modal-newclustercustom");
                this.reloadComponent();
            } catch (e: any) {
                console.log(e);
                alert(e.error.message);
            }
        }

    }

    /*
     * Create Cluster Objects
     */
    async createClusterRelatedObjects(
        name: string,
        namespace: string,
        labelkeyone: string,
        labelvalueone: string,
        labelkeytwo: string,
        labelvaluetwo: string,
        labelkeythree: string,
        labelvaluethree: string,
        cni: string,
        cniversion: string,
        clustercnivxlanport: string,
        podcidr: string,
        svccidr: string,
        controlplaneeptype: string,
        controlplaneepannotationskeyone: string,
        controlplaneepannotationsvalueone: string,
        controlplaneepannotationskeytwo: string,
        controlplaneepannotationsvaluetwo: string
    ) {
        /* Creating our Objects */
        let thisClusterObj = new KClusterTemplate().Cluster;
        let thisKubevirtClusterObj = new KClusterTemplate().KubevirtCluster;

        /* Load Custom Labels */
        let tmpLabels = {};
        if(labelkeyone != "") {
            let thisLabel = {
                [labelkeyone]: labelvalueone
            };
            Object.assign(tmpLabels, thisLabel);
        }
        if(labelkeytwo != "") {
            let thisLabel = {
                [labelkeytwo]: labelvaluetwo
            };
            Object.assign(tmpLabels, thisLabel);
        }
        if(labelkeythree != "") {
            let thisLabel = {
                [labelkeythree]: labelvaluethree
            };
            Object.assign(tmpLabels, thisLabel);
        }

        /* Load other labels */
        let thisLabel = {'kubevirt-manager.io/cluster-name': name};
        Object.assign(tmpLabels, thisLabel);

        let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
        Object.assign(tmpLabels, kubevirtManagerLabel);

        if(cni.toLowerCase() != "manual") {

            let thisCNILabel = {'capk.kubevirt-manager.io/cni': cni};
            Object.assign(tmpLabels, thisCNILabel);

            let thisCNIVersionLabel = {'capk.kubevirt-manager.io/cni-version': cniversion};
            Object.assign(tmpLabels, thisCNIVersionLabel);

            let thisCNIVXLANPortLabel = {'capk.kubevirt-manager.io/cni-vxlanport': clustercnivxlanport};
            Object.assign(tmpLabels, thisCNIVXLANPortLabel);
        }

        /* Load Annotations */
        let tmpAnnotations = {};
        if(controlplaneepannotationskeyone != "") {
            let thisAnnotations = {
                [controlplaneepannotationskeyone]: controlplaneepannotationsvalueone
            };
            Object.assign(tmpAnnotations, thisAnnotations);
        }
        if(controlplaneepannotationskeytwo != "") {
            let thisAnnotations = {
                [controlplaneepannotationskeytwo]: controlplaneepannotationsvaluetwo
            };
            Object.assign(tmpAnnotations, thisAnnotations);
        }
        
        thisClusterObj.metadata.name = name;
        thisClusterObj.metadata.namespace = namespace;
        thisClusterObj.metadata.labels = tmpLabels;
        thisClusterObj.spec.clusterNetwork.pods.cidrBlocks[0] = podcidr;
        thisClusterObj.spec.clusterNetwork.services.cidrBlocks[0] = svccidr;
        thisClusterObj.spec.controlPlaneRef.name = name + "-control-plane";
        thisClusterObj.spec.controlPlaneRef.namespace = namespace;
        thisClusterObj.spec.infrastructureRef.name = name;
        thisClusterObj.spec.infrastructureRef.namespace = namespace;

        thisKubevirtClusterObj.metadata.name = name;
        thisKubevirtClusterObj.metadata.namespace = namespace;
        thisKubevirtClusterObj.metadata.labels = tmpLabels;
        thisKubevirtClusterObj.spec.controlPlaneServiceTemplate.metadata.labels = tmpLabels;
        thisKubevirtClusterObj.spec.controlPlaneServiceTemplate.metadata.annotations = tmpAnnotations;
        thisKubevirtClusterObj.spec.controlPlaneServiceTemplate.spec.type = controlplaneeptype;

        try {
            let data = await lastValueFrom(this.xK8sService.createCluster(namespace, name, thisClusterObj));
            data = await lastValueFrom(this.xK8sService.createKubevirtCluster(namespace, thisKubevirtClusterObj));
        } catch (e: any) {
            console.log(e);
            alert(e.error.message);
        }

    }

    /*
     * Create Control Plane Objects
     */
    async createControlPlaneRelatedObjects(
        name: string,
        namespace: string,
        version: string,
        dns: string,
        podcidr: string,
        svccidr: string,
        network: string,
        networktype: string,
        controlplaneosdist: string,
        controlplaneosversion: string,
        controlplaneosimageurl: string,
        controlplanetype: string,
        controlplanecpumemsockets: string,
        controlplanecpumemcores: string,
        controlplanecpumemthreads: string,
        controlplanecpumemmemory: string,
        controlplanepc: string,
        controlplanereplicas: string,
        controlplanedisksize: string,
        controlplanedisksc: string,
        controlplanediskam: string,
        controlplanediskcm: string,
    ) {
        /* Creating our local objects */
        let thisKubeadmControlPlaneObj = new KClusterTemplate().KubeadmControlPlane;
        let thisKubevirtMachineTemplateTyped = new KClusterTemplate().KubevirtMachineTemplateType;
        let thisKubevirtMachineTemplateCustom = new KClusterTemplate().KubevirtMachineTemplateCustom;

        /* Custom Labels */
        let tmpLabels = {};
        let machineTemplateLabels = {};

        /* Load other labels */
        let thisLabel = {'kubevirt-manager.io/cluster-name': name};
        Object.assign(tmpLabels, thisLabel);
        Object.assign(machineTemplateLabels, thisLabel);

        let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
        Object.assign(tmpLabels, kubevirtManagerLabel);

        
        /* Machine Labels */
        Object.assign(machineTemplateLabels, { 'kubevirt-manager.io/cluster-name': name });
        Object.assign(machineTemplateLabels, { 'kubevirt-manager.io/managed': "true" });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/flavor': controlplaneosdist });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/flavor-version': controlplaneosversion });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/kube-version' : version });
        Object.assign(machineTemplateLabels, { 'kubevirt.io/domain': name + "-control-plane" });

        /* KubeadmControlPlane */
        thisKubeadmControlPlaneObj.metadata.name = name + "-control-plane";
        thisKubeadmControlPlaneObj.metadata.namespace = namespace;
        thisKubeadmControlPlaneObj.metadata.labels = tmpLabels;
        thisKubeadmControlPlaneObj.spec.kubeadmConfigSpec.clusterConfiguration.networking.dnsDomain = dns;
        thisKubeadmControlPlaneObj.spec.kubeadmConfigSpec.clusterConfiguration.networking.podSubnet = podcidr;
        thisKubeadmControlPlaneObj.spec.kubeadmConfigSpec.clusterConfiguration.networking.serviceSubnet = svccidr;
        thisKubeadmControlPlaneObj.spec.machineTemplate.infrastructureRef.name = name + "-control-plane";
        thisKubeadmControlPlaneObj.spec.machineTemplate.infrastructureRef.namespace = namespace;
        thisKubeadmControlPlaneObj.spec.replicas = Number(controlplanereplicas);
        thisKubeadmControlPlaneObj.spec.version = version;


        /* 
         * Kubevirt Machine Template
         */

        /* Check Control Plane VM Type */
        if(controlplanetype.toLowerCase() == "custom") {
            /* Custom VM */
            thisKubevirtMachineTemplateCustom.metadata.name = name + "-control-plane";
            thisKubevirtMachineTemplateCustom.metadata.namespace = namespace;
            thisKubevirtMachineTemplateCustom.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.metadata.namespace = namespace;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.metadata.labels = machineTemplateLabels;

            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = controlplanepc;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.cores = Number(controlplanecpumemcores);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.threads = Number(controlplanecpumemthreads);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.sockets = Number(controlplanecpumemsockets);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.resources.requests.memory = controlplanecpumemmemory + "Gi";

            /* Clean up devices */
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
            }
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
            }
            
            /* Clean up networks */
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
            }
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
            }

        } else {
            /* Typed VM */
            thisKubevirtMachineTemplateTyped.metadata.name = name + "-control-plane";
            thisKubevirtMachineTemplateTyped.metadata.namespace = namespace;
            thisKubevirtMachineTemplateTyped.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.metadata.namespace = namespace;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.metadata.labels = machineTemplateLabels;

            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.instancetype.name = controlplanetype;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = controlplanepc;

            /* Clean up devices */
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
            }
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
            }
        
            /* Clean up networks */
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
            }
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
            }

        }

        /* Create Disk From Image */
        let disk1 = {};
        let device1 = {};
        let disk1dv = new DataVolume().httpDisk;
        let disk1name = "disk1";
        disk1dv.metadata.name = disk1name;
        disk1dv.metadata.namespace = namespace;
        disk1dv.spec.pvc.storageClassName = controlplanedisksc;
        disk1dv.spec.pvc.accessModes[0] = controlplanediskam;
        disk1dv.spec.pvc.resources.requests.storage = controlplanedisksize + "Gi";
        disk1dv.spec.source.http.url = controlplaneosimageurl;
        if(controlplanediskcm != "") {
            disk1 = { 'name': "disk1", 'cache': controlplanediskcm, 'disk': {}};
        } else {
            disk1 = { 'name': "disk1", 'disk': {}};
        }
        device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}

        /* Network Setup */
        let net1 = {};
        let iface1 = {};
        if(network != "podNetwork") {
            net1 = {'name': "net1", 'multus': {'networkName': network}};
        } else {
            net1 = {'name': "net1", 'pod': {}};
        }
        if(networktype == "bridge") {
            iface1 = {'name': "net1", 'bridge': {}};
        } else {
            iface1 = {'name': "net1", 'masquerade': {}};
        }

        if(controlplanetype.toLowerCase() == "custom") {
            /* Disk Setup */
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.dataVolumeTemplates[0] = disk1dv;

            /* Net Setup */
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);

            try {
                let data = await lastValueFrom(this.xK8sService.createKubeadmControlPlane(namespace, thisKubeadmControlPlaneObj));
                data = await lastValueFrom(this.xK8sService.createKubevirtMachineTemplate(namespace, thisKubevirtMachineTemplateCustom));
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        } else {
            /* Disk Setup */
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.dataVolumeTemplates[0] = disk1dv;

            /* Net Setup */
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);

            try {
                let data = await lastValueFrom(this.xK8sService.createKubeadmControlPlane(namespace, thisKubeadmControlPlaneObj));
                data = await lastValueFrom(this.xK8sService.createKubevirtMachineTemplate(namespace, thisKubevirtMachineTemplateTyped));
            } catch (e: any) {
                console.log(e);
                alert(e.error.message);
            }
        }
    }

     /*
     * Create Node Pool Objects
     */
     async createNodePoolRelatedObjects(
        name: string,
        namespace: string,
        version: string,
        network: string,
        networktype: string,
        nodepoolname: string,
        nodepoolosdist: string,
        nodepoolosversion: string,
        nodepoolosimageurl: string,
        nodepooltype: string,
        nodepoolcpumemsockets: string,
        nodepoolcpumemcores: string,
        nodepoolcpumemthreads: string,
        nodepoolcpumemmemory: string,
        nodepoolpc: string,
        nodepoolreplicas: string,
        nodepooldisksize: string,
        nodepooldisksc: string,
        nodepooldiskam: string,
        nodepooldiskcm: string,
    ) {
        /* Creating our local objects */
        let thisKubeadmConfigTemplateObj = new KClusterTemplate().KubeadmConfigTemplate;
        let thisMachineDeploymentObj = new KClusterTemplate().MachineDeployment;
        let thisKubevirtMachineTemplateTyped = new KClusterTemplate().KubevirtMachineTemplateType;
        let thisKubevirtMachineTemplateCustom = new KClusterTemplate().KubevirtMachineTemplateCustom;

        /* Custom Labels */
        let tmpLabels = {};
        let machineTemplateLabels = {};

        /* Load other labels */
        let thisLabel = {'kubevirt-manager.io/cluster-name': name};
        Object.assign(tmpLabels, thisLabel);
        Object.assign(machineTemplateLabels, thisLabel);

        let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
        Object.assign(tmpLabels, kubevirtManagerLabel);

        
        /* Machine Labels */
        Object.assign(machineTemplateLabels, { 'kubevirt-manager.io/cluster-name': name });
        Object.assign(machineTemplateLabels, { 'kubevirt-manager.io/managed': "true" });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/flavor': nodepoolosdist });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/flavor-version': nodepoolosversion });
        Object.assign(machineTemplateLabels, { 'capk.kubevirt-manager.io/kube-version' : version });
        Object.assign(machineTemplateLabels, { 'kubevirt.io/domain': name + "-" + nodepoolname });

        /* KubeadmConfig */
        thisKubeadmConfigTemplateObj.metadata.name = name + "-" + nodepoolname;
        thisKubeadmConfigTemplateObj.metadata.namespace = namespace;
        thisKubeadmConfigTemplateObj.metadata.labels = tmpLabels;
        thisKubeadmConfigTemplateObj.spec.template.metadata.labels = tmpLabels;

        /* MachineDeployment */
        thisMachineDeploymentObj.metadata.name = name + "-" + nodepoolname;
        thisMachineDeploymentObj.metadata.namespace = namespace;
        thisMachineDeploymentObj.metadata.labels = tmpLabels;
        thisMachineDeploymentObj.spec.clusterName = name;
        thisMachineDeploymentObj.spec.replicas = Number(nodepoolreplicas);
        thisMachineDeploymentObj.spec.template.metadata.labels = tmpLabels;
        thisMachineDeploymentObj.spec.template.spec.clusterName = name;
        thisMachineDeploymentObj.spec.template.spec.version = version;
        thisMachineDeploymentObj.spec.template.spec.bootstrap.configRef.name = name + "-" + nodepoolname;
        thisMachineDeploymentObj.spec.template.spec.bootstrap.configRef.namespace = namespace;
        thisMachineDeploymentObj.spec.template.spec.infrastructureRef.name = name + "-" + nodepoolname;
        thisMachineDeploymentObj.spec.template.spec.infrastructureRef.namespace = namespace;

        /* 
         * Kubevirt Machine Template
         */

        /* Check Node Pool VM Type */
        if(nodepooltype.toLowerCase() == "custom") {
            /* Custom VM */
            thisKubevirtMachineTemplateCustom.metadata.name = name + "-" + nodepoolname;
            thisKubevirtMachineTemplateCustom.metadata.namespace = namespace;
            thisKubevirtMachineTemplateCustom.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.metadata.namespace = namespace;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.metadata.labels = machineTemplateLabels;

            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = nodepoolpc;
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.cores = Number(nodepoolcpumemcores);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.threads = Number(nodepoolcpumemthreads);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.sockets = Number(nodepoolcpumemsockets);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.resources.requests.memory = nodepoolcpumemmemory + "Gi";

            /* Clean up devices */
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
            }
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
            }
            
            /* Clean up networks */
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
            }
            while(thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
            }

        } else {
            /* Typed VM */
            thisKubevirtMachineTemplateTyped.metadata.name = name + "-" + nodepoolname;
            thisKubevirtMachineTemplateTyped.metadata.namespace = namespace;
            thisKubevirtMachineTemplateTyped.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.metadata.namespace = namespace;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.metadata.labels = machineTemplateLabels;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.metadata.labels = machineTemplateLabels;

            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.instancetype.name = nodepooltype;
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = nodepoolpc;

            /* Clean up devices */
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
            }
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
            }
        
            /* Clean up networks */
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
            }
            while(thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
            }

        }

        /* Create Disk From Image */
        let disk1 = {};
        let device1 = {};
        let disk1dv = new DataVolume().httpDisk;
        let disk1name = "disk1";
        disk1dv.metadata.name = disk1name;
        disk1dv.metadata.namespace = namespace;
        disk1dv.spec.pvc.storageClassName = nodepooldisksc;
        disk1dv.spec.pvc.accessModes[0] = nodepooldiskam;
        disk1dv.spec.pvc.resources.requests.storage = nodepooldisksize + "Gi";
        disk1dv.spec.source.http.url = nodepoolosimageurl;
        if(nodepooldiskcm != "") {
            disk1 = { 'name': "disk1", 'cache': nodepooldiskcm, 'disk': {}};
        } else {
            disk1 = { 'name': "disk1", 'disk': {}};
        }
        device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}

        /* Network Setup */
        let net1 = {};
        let iface1 = {};
        if(network != "podNetwork") {
            net1 = {'name': "net1", 'multus': {'networkName': network}};
        } else {
            net1 = {'name': "net1", 'pod': {}};
        }
        if(networktype == "bridge") {
            iface1 = {'name': "net1", 'bridge': {}};
        } else {
            iface1 = {'name': "net1", 'masquerade': {}};
        }

        if(nodepooltype.toLowerCase() == "custom") {
            /* Disk Setup */
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.dataVolumeTemplates[0] = disk1dv;

            /* Net Setup */
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
            thisKubevirtMachineTemplateCustom.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);

            try {
                let data = await lastValueFrom(this.xK8sService.createKubevirtMachineTemplate(namespace, thisKubevirtMachineTemplateCustom));
                data = await lastValueFrom(this.xK8sService.createKubeadmConfigTemplate(namespace, thisKubeadmConfigTemplateObj));
                data = await lastValueFrom(this.xK8sService.createMachineDeployment(namespace, thisMachineDeploymentObj));
            } catch (e: any) {
                console.log(e);
                alert(e.error.message);
            }
        } else {
            /* Disk Setup */
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.dataVolumeTemplates[0] = disk1dv;

            /* Net Setup */
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
            thisKubevirtMachineTemplateTyped.spec.template.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);

            try {
                let data = await lastValueFrom(this.xK8sService.createKubevirtMachineTemplate(namespace, thisKubevirtMachineTemplateTyped));
                data = await lastValueFrom(this.xK8sService.createKubeadmConfigTemplate(namespace, thisKubeadmConfigTemplateObj));
                data = await lastValueFrom(this.xK8sService.createMachineDeployment(namespace, thisMachineDeploymentObj));
            } catch (e: any) {
                console.log(e);
                alert(e.error.message);
            }
        }
    }

    /*
     * Load Secret with Cluster Objects and CNI
     */
    async loadCNIandFeaturesIntoCluster(clustername: string,
        clusternamespace: string,
        clustercni: string,
        clustercniversion: string,
        clustercnivxlanport: string,
        clusterpodcidr: string,
        clusterfeaturescertmanager: boolean,
        clusterfeaturesdashboard: boolean,
        clusterfeaturesmetrics: boolean,
        clusterfeatureshaproxyingress: boolean,
        clusterfeaturesnginxingress: boolean,
        clusterfeaturestekton: boolean
        ) {
            let thisClusterResourceSetObj = new KClusterTemplate().ClusterResourceSet;
            let thisClusterSecret = new KClusterTemplate().ClusterConfigSecret;
            let secretData = {};
            let checkData = false;
            let tmpLabels = {};

            /* Load other labels */
            let thisLabel = {'kubevirt-manager.io/cluster-name': clustername};
            Object.assign(tmpLabels, thisLabel);

            let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
            Object.assign(tmpLabels, kubevirtManagerLabel);

            if(clustercni.toLowerCase() != "manual") {

                checkData = true;
                let thisCNILabel = {'capk.kubevirt-manager.io/cni': clustercni};
                Object.assign(tmpLabels, thisCNILabel);

                let thisCNIVersionLabel = {'capk.kubevirt-manager.io/cni-version': clustercniversion};
                Object.assign(tmpLabels, thisCNIVersionLabel);

                let thisCNIVXLANPortLabel = {'capk.kubevirt-manager.io/cni-vxlanport': clustercnivxlanport};
                Object.assign(tmpLabels, thisCNIVXLANPortLabel);


                let cniBase64 = await this.generateCNIBase64(this.getCNIUrl(clustercni, clustercniversion), clusterpodcidr, clustercnivxlanport);

                Object.assign(secretData, { 'cni.yaml' : cniBase64.toString() });
            }

            if(clusterfeaturescertmanager) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "certmanager") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'cert-manager.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(clusterfeaturesdashboard) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "dashboard") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'dashboard.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(clusterfeaturesmetrics) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "metrics") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'metrics.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(clusterfeatureshaproxyingress) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "haproxy-ingress") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'haproxy-ingress.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(clusterfeaturesnginxingress) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "nginx-ingress") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'nginx-ingress.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(clusterfeaturestekton) {
                for(let i = 0; i < this.featureList.features.length; i++) {
                    let thisFeature = this.featureList.features[i];
                    if(thisFeature.id == "tekton") {
                        let thisFeatureBase64 = await this.generateBase64(thisFeature.filename);
                        Object.assign(secretData, { 'tekton.yaml' : thisFeatureBase64 });
                        checkData = true;
                    }
                }
            }

            if(checkData) {
                thisClusterSecret.metadata.name = clustername + "-config";
                thisClusterSecret.metadata.namespace = clusternamespace;
                thisClusterSecret.data = secretData;

                thisClusterResourceSetObj.metadata.name = clustername;
                thisClusterResourceSetObj.metadata.namespace = clusternamespace;
                thisClusterResourceSetObj.spec.clusterSelector.matchLabels['capk.kubevirt-manager.io/cni'] = clustercni;
                thisClusterResourceSetObj.spec.clusterSelector.matchLabels['kubevirt-manager.io/cluster-name'] = clustername;
                thisClusterResourceSetObj.spec.resources[0].name = clustername + "-config";
                thisClusterResourceSetObj.spec.resources[0].namespace = clusternamespace;

                try {
                    let data = await lastValueFrom(this.xK8sService.createConfigSecret(clusternamespace, thisClusterSecret));
                    data = await lastValueFrom(this.xK8sService.createClusterResourseSet(clusternamespace, thisClusterResourceSetObj));
                } catch (e: any) {
                    console.log(e);
                }
            }

        } 

    /*
     * Create Kubevirt Cloud Controller 
     */
    async loadKubevirtCloudControllerManager(namespace: string, name: string): Promise<void> {
        let thisServiceAccount = new KClusterTemplate().KCCMServiceAccount;
        let thisRoleBinding = new KClusterTemplate().KCCMRoleBinding;
        let thisConfigMap = new KClusterTemplate().KCCMConfigMap;
        let thisController = new KClusterTemplate().KCCMController;


        /* Custom Labels */
        let tmpLabels = {};

        /* Load labels */
        let thisLabel = {'kubevirt-manager.io/cluster-name': name};
        Object.assign(tmpLabels, thisLabel);
        let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
        Object.assign(tmpLabels, kubevirtManagerLabel);
        Object.assign(tmpLabels, { 'cluster.x-k8s.io/cluster-name': name });
        Object.assign(tmpLabels, { 'capk.cluster.x-k8s.io/template-kind': "extra-resource" });

        /* Service Account */
        thisServiceAccount.metadata.name = name + "-kcc";
        thisServiceAccount.metadata.namespace = namespace;
        thisServiceAccount.metadata.labels = tmpLabels;

        /* Role Binding */
        thisRoleBinding.metadata.name = name + "-kcc";
        thisRoleBinding.metadata.namespace = namespace;
        thisRoleBinding.metadata.labels = tmpLabels;
        thisRoleBinding.subjects[0].name = name + "-kcc";
        thisRoleBinding.subjects[0].namespace = namespace;

        /* Config Map */
        thisConfigMap.metadata.name = name + "-kcc";
        thisConfigMap.metadata.namespace = namespace;
        thisConfigMap.metadata.labels = tmpLabels;
        /* controller config */
        thisConfigMap.data['cloud-config']  = "loadBalancer:\n";
        thisConfigMap.data['cloud-config'] += "  creationPollInterval: 30\n";
        thisConfigMap.data['cloud-config'] += "namespace: " + namespace + "\n";
        thisConfigMap.data['cloud-config'] += "infraLabels:\n";
        thisConfigMap.data['cloud-config'] += "  kubevirt-manager.io/managed: \"true\"\n";
        thisConfigMap.data['cloud-config'] += "instancesV2:\n";
        thisConfigMap.data['cloud-config'] += "  enabled: true\n";
        thisConfigMap.data['cloud-config'] += "  zoneAndRegionEnabled: false\n";

        /* Controller */
        let controllerLabels = tmpLabels;
        Object.assign(controllerLabels, { 'app': "kubevirt-cloud-controller-manager" });
        thisController.metadata.name = name + "-kcc";
        thisController.metadata.namespace = namespace;
        thisController.metadata.labels = controllerLabels;
        thisController.spec.selector.matchLabels = controllerLabels;
        thisController.spec.template.metadata.labels = controllerLabels;
        thisController.spec.template.spec.serviceAccountName = name + "-kcc";
        thisController.spec.template.spec.containers[0].args[3] = "--cluster-name=" + name;
        let device1 = { 'name': "cloud-config", 'configMap': { 'name': name + "-kcc"}};
        let device2 = { 'name': "kubeconfig", 'secret': { 'secretName': name + "-kubeconfig"}};

        while(thisController.spec.template.spec.volumes.length > 0){
            thisController.spec.template.spec.volumes.pop();
        }
        thisController.spec.template.spec.volumes.push(device1);
        thisController.spec.template.spec.volumes.push(device2);

        try {
            let data = await lastValueFrom(this.xK8sService.createKCCServiceAccount(namespace, thisServiceAccount));
            data = await lastValueFrom(this.xK8sService.createKCCRoleBinding(namespace, thisRoleBinding));
            data = await lastValueFrom(this.xK8sService.createKCCConfigMap(namespace, thisConfigMap));
            data = await lastValueFrom(this.xK8sService.createKCCController(namespace, thisController));
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Retrieve Image Url
     */
    getImageUrl(version: string, osdist: string, osversion: string): string {
        let myUrl = "";
        for(let i = 0; i < this.clusterImageList.versions.length; i++) {
            if(this.clusterImageList.versions[i].id == version) {
                for(let j = 0; j < this.clusterImageList.versions[i].flavors.length; j++) {
                    if(this.clusterImageList.versions[i].flavors[j].id == osdist) {
                        for(let k = 0; k < this.clusterImageList.versions[i].flavors[j].versions.length; k++) {
                            if(this.clusterImageList.versions[i].flavors[j].versions[k].id == osversion) {
                                myUrl = this.clusterImageList.versions[i].flavors[j].versions[k].image;
                            }
                        }
                    }
                }
            }
        }
        return myUrl.toString();
    }

    /*
     * Retrieve CNI Url
     */
    getCNIUrl(cni: string, version: string): string {
        let myUrl = "";
        for(let i = 0; i < this.cniList.cnis.length; i++) {
            if(this.cniList.cnis[i].id == cni) {
                for(let j = 0; j < this.cniList.cnis[i].versions.length; j++) {
                    if(this.cniList.cnis[i].versions[j].id == version) {
                        myUrl = this.cniList.cnis[i].versions[j].filename;
                    }
                }
            }
        }
        return myUrl.toString();
    }

    /*
     * Generate Base 64 from URL Content
     */
    async generateBase64(Url: string): Promise<string> {
        let myBase64 = "";
        let myData = await lastValueFrom(this.kubevirtMgrCapk.loadFile(Url));
        myBase64 = Buffer.from(myData).toString('base64');
        return myBase64;
    }

    /*
     * Generate CNI Base64 with CIDR
     */
    async generateCNIBase64(Url: string, cidr: string, port: string): Promise<string> {
        let myBase64 = "";
        let cniData = await lastValueFrom(this.kubevirtMgrCapk.loadFile(Url));
        let myData = cniData.toString().replace("KUBEVIRTMGR_POD_CIDR", cidr);
        myData = myData.replace("KUBEVIRTMGR_VXLAN_PORT", port);
        myBase64 = Buffer.from(myData).toString('base64');
        return myBase64;
    }

    /*
     * Generate VXLAN tunnel port
     */
    generateVXLANPort(): Number {
        // Random number between 6700-6800
        return Math.floor(Math.random() * (6800 - 6700 + 1) + 6700)
    }

    /*
     * Check Cluster Exists
     */
    checkClusterExists(clusterName: string, clusterNamespace:string): boolean {
        for (let i = 0; i < this.clusterList.length; i++) {
            if(this.clusterList[i].name == clusterName && this.clusterList[i].namespace == clusterNamespace) {
                return true;
            }
        }
        return false;
    }

    /*
     * Hide Component
     */
    hideComponent(divId: string): void {
        let modalDiv = document.getElementById(divId);
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
        }
        this.myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);
    }

    /*
     * UPDATE New Cluster DNS according to cluster name
     */
    updateClusterDNS(newname: string): void {
        let suffix = ".cluster.local";
        let clusterDNSField = document.getElementById("newcluster-dns");
        if(clusterDNSField != null) {
            clusterDNSField.setAttribute("value", newname + suffix);
        }
    }

    /*
     * UPDATE New Cluster DNS according to cluster name
     */
    updateClusterDNSCustom(newname: string): void {
        let suffix = ".cluster.local";
        let clusterDNSField = document.getElementById("newclustercustom-dns");
        if(clusterDNSField != null) {
            clusterDNSField.setAttribute("value", newname + suffix);
        }
    }

    /*
     * UPDATE New Cluster DNS according to cluster name
     */
    onChangeCNI(cni: string): void {
        let clusterCNIVersionField = document.getElementById("newcluster-cniversion");
        let clusterCNIVersionValues = "";
        if(cni == "manual") {
            if(clusterCNIVersionField != null) {
                clusterCNIVersionField.setAttribute("disabled", "disabled");
                clusterCNIVersionField.innerHTML = clusterCNIVersionValues;
            }
        } else {
            for(let i = 0; i < this.cniList.cnis.length; i++) {
                if(this.cniList.cnis[i].id == cni) {
                    for(let j = 0; j < this.cniList.cnis[i].versions.length; j++) {
                        clusterCNIVersionValues += "<option value=" +  this.cniList.cnis[i].versions[j].id +">" + this.cniList.cnis[i].versions[j].name + "</option>\n";
                    }
                }
            }
            if(clusterCNIVersionField != null) {
                clusterCNIVersionField.removeAttribute("disabled");
                clusterCNIVersionField.innerHTML = clusterCNIVersionValues;
            }
        }
    }

    /*
     * UPDATE: Fill Distro Options for Control Plane and Node Pool and Enable CNI Field
     */
    onChangeKubernetesVersion(version: string): void {
        let clusterCNIField = document.getElementById("newcluster-cni");
        let controlPlaneOSField = document.getElementById("newcluster-controlplane-osdist");
        let nodePoolOSField = document.getElementById("newcluster-nodepool-osdist");
        let operatingSystems = "";
        if(version == "none") {
            if(clusterCNIField != null) {
                clusterCNIField.setAttribute("disabled","disabled");
            }
            if(controlPlaneOSField != null && nodePoolOSField != null) {
                controlPlaneOSField.innerHTML = operatingSystems;
                nodePoolOSField.innerHTML = operatingSystems;
            }
        } else {
            operatingSystems = "<option value=none></option>";
            for(let i = 0; i < this.clusterImageList.versions.length; i++) {
                if(this.clusterImageList.versions[i].id == version) {
                    for(let j = 0; j < this.clusterImageList.versions[i].flavors.length; j++) {
                        operatingSystems += "<option value=" +  this.clusterImageList.versions[i].flavors[j].id +">" + this.clusterImageList.versions[i].flavors[j].name + "</option>\n";
                    }
                }
            }
            if(controlPlaneOSField != null && nodePoolOSField != null) {
                controlPlaneOSField.innerHTML = operatingSystems;
                nodePoolOSField.innerHTML = operatingSystems;
            }
            if(clusterCNIField != null) {
                clusterCNIField.removeAttribute("disabled");
            }
        }
    }

    /*
     * UPDATE: Fill Distro Versions fro Control Plane
     */
    onChangeControlPlaneOS(version: string, os: string): void {
        let controlPlaneOSVersionField = document.getElementById("newcluster-controlplane-osversion");
        let operatingSystemVersions = "";
        if(os == "none") {
            if(controlPlaneOSVersionField != null) {
                controlPlaneOSVersionField.innerHTML = operatingSystemVersions;
            }
        } else {
            for(let i = 0; i < this.clusterImageList.versions.length; i++) {
                if(this.clusterImageList.versions[i].id == version) {
                    for(let j = 0; j < this.clusterImageList.versions[i].flavors.length; j++) {
                        if(this.clusterImageList.versions[i].flavors[j].id == os) {
                            for(let k = 0; k < this.clusterImageList.versions[i].flavors[j].versions.length; k++) {
                                operatingSystemVersions += "<option value=" +  this.clusterImageList.versions[i].flavors[j].versions[k].id +">" + this.clusterImageList.versions[i].flavors[j].versions[k].printablename + "</option>\n";
                            }
                        }
                    }
                }
            }
            if(controlPlaneOSVersionField != null) {
                controlPlaneOSVersionField.innerHTML = operatingSystemVersions;
            }
        }
    }

    /*
     * UPDATE: Fill Distro Versions fro Node Pool
     */
    onChangeNodePoolOS(version: string, os: string): void {
        let nodePoolOSVersionField = document.getElementById("newcluster-nodepool-osversion");
        let operatingSystemVersions = "";
        if(os == "none") {
            if(nodePoolOSVersionField != null) {
                nodePoolOSVersionField.innerHTML = operatingSystemVersions;
            }
        } else {
            for(let i = 0; i < this.clusterImageList.versions.length; i++) {
                if(this.clusterImageList.versions[i].id == version) {
                    for(let j = 0; j < this.clusterImageList.versions[i].flavors.length; j++) {
                        if(this.clusterImageList.versions[i].flavors[j].id == os) {
                            for(let k = 0; k < this.clusterImageList.versions[i].flavors[j].versions.length; k++) {
                                operatingSystemVersions += "<option value=" +  this.clusterImageList.versions[i].flavors[j].versions[k].id +">" + this.clusterImageList.versions[i].flavors[j].versions[k].printablename + "</option>\n";
                            }
                        }
                    }
                }
            }
            if(nodePoolOSVersionField != null) {
                nodePoolOSVersionField.innerHTML = operatingSystemVersions;
            }
        }
    }

    /*
     * Control Plane Type
     */
    async onChangeControlPlaneType(vmType: string) {
        let modalDiv = document.getElementById("controlplane-custom-cpu-memory");
        if(vmType.toLowerCase() == "custom") {
            if(modalDiv != null) {
                modalDiv.setAttribute("class", "modal fade show");
                modalDiv.setAttribute("aria-modal", "true");
                modalDiv.setAttribute("role", "dialog");
                modalDiv.setAttribute("aria-hidden", "false");
                modalDiv.setAttribute("style","display: contents;");
            }
        } else {
            if(modalDiv != null) {
                modalDiv.setAttribute("class", "modal fade");
                modalDiv.setAttribute("aria-modal", "false");
                modalDiv.setAttribute("role", "");
                modalDiv.setAttribute("aria-hidden", "true");
                modalDiv.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * Node Pool Type
     */
    async onChangeNodePoolType(vmType: string) {
        let modalDiv = document.getElementById("nodepool-custom-cpu-memory");
        if(vmType.toLowerCase() == "custom") {
            if(modalDiv != null) {
                modalDiv.setAttribute("class", "modal fade show");
                modalDiv.setAttribute("aria-modal", "true");
                modalDiv.setAttribute("role", "dialog");
                modalDiv.setAttribute("aria-hidden", "false");
                modalDiv.setAttribute("style","display: contents;");
            }
        } else {
            if(modalDiv != null) {
                modalDiv.setAttribute("class", "modal fade");
                modalDiv.setAttribute("aria-modal", "false");
                modalDiv.setAttribute("role", "");
                modalDiv.setAttribute("aria-hidden", "true");
                modalDiv.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/kcluster`]);
        })
    }

}
