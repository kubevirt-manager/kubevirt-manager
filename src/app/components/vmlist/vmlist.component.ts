import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { K8sService } from 'src/app/services/k8s.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { KubeVirtVMI } from 'src/app/models/kube-virt-vmi.model';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { VMDisk } from 'src/app/models/vmdisk.model';
import { NetworkAttach } from 'src/app/models/network-attach.model';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { DataVolume } from 'src/app/interfaces/data-volume';
import { VirtualMachine } from 'src/app/interfaces/virtual-machine';
import { KubevirtMgrService } from 'src/app/services/kubevirt-mgr.service';
import { FirewallLabels } from 'src/app/models/firewall-labels.model';


@Component({
  selector: 'app-vmlist',
  templateUrl: './vmlist.component.html',
  styleUrls: ['./vmlist.component.css']
})
export class VmlistComponent implements OnInit {

    nodeList: K8sNode[] = [];
    vmList: KubeVirtVM[] = [];
    diskList: VMDisk[] = [];
    namespaceList: string[] = [];
    networkList: NetworkAttach[] = [];
    netAttachList: NetworkAttach[] = []
    networkCheck: boolean = false;
    firewallLabels: FirewallLabels = new FirewallLabels;

    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private k8sService: K8sService,
        private dataVolumesService: DataVolumesService,
        private k8sApisService: K8sApisService,
        private kubeVirtService: KubeVirtService,
        private kubevirtMgrService: KubevirtMgrService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getVMs();
        await this.getNodes();
        await this.checkNetwork();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machines");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Load Nodes
     */
    async getNodes(): Promise<void> {
        this.nodeList = [];
        try {
            let currentNode = new K8sNode;
            const data = await lastValueFrom(this.k8sService.getNodes());
            let nodes = data.items;
            for (let i = 0; i < nodes.length; i++) {
                currentNode = new K8sNode();
                currentNode.name = nodes[i].metadata["name"];
                for(let j = 0; j < this.vmList.length; j++) {
                    if (this.vmList[j].nodeSel == currentNode.name)
                        currentNode.vmlist.push(this.vmList[j]);
                }
                this.nodeList.push(currentNode);
            }
            /* auto-selects node when power on vm */
            currentNode = new K8sNode();
            currentNode.name = "auto-select";
            for(let j = 0; j < this.vmList.length; j++) {
                if (this.vmList[j].nodeSel == currentNode.name)
                    currentNode.vmlist.push(this.vmList[j]);
            }
            this.nodeList.push(currentNode);
        } catch (e: any) {
            console.log(e.error.message);
        }
    }

    /*
     * Load VM List
     */
    async getVMs(): Promise<void> {
        this.vmList = [];
        let currentVm = new KubeVirtVM;
        const data = await lastValueFrom(this.kubeVirtService.getVMs());
        let vms = data.items;
        for (let i = 0; i < vms.length; i++) {
            currentVm = new KubeVirtVM();
            currentVm.name = vms[i].metadata["name"];
            currentVm.namespace = vms[i].metadata["namespace"];
            currentVm.creationTimestamp = new Date(vms[i].metadata["creationTimestamp"]);
            try {
                currentVm.status = vms[i].status["printableStatus"].toLowerCase();
                /* Working around a bug when scaling down and VM stuck in terminating */
                if(currentVm.status.toLowerCase() == "terminating") {
                    currentVm.running = false;
                } else if (currentVm.status.toLowerCase() == "running") {
                    currentVm.running = true;
                } else {
                    currentVm.running = vms[i].spec["running"];
                }
            } catch (e: any) {
                currentVm.status = "";
                currentVm.running = false;
                console.log("Error loading VM status");
            }
            try {
                currentVm.nodeSel = vms[i].spec.template.spec.nodeSelector["kubernetes.io/hostname"];
            } catch (e: any) {
                currentVm.nodeSel = "auto-select";
                console.log("No nodeSelector, using auto-select");
            }

            /* Getting VM Type */
            try {
                currentVm.instType = vms[i].spec.instancetype.name;
            } catch(e: any) {
                currentVm.instType = "custom";
                console.log("custom vm");
            }

            if(currentVm.instType == "custom") {
                try {
                    /* Custom VM has cpu / mem parameters */
                    currentVm.cores = vms[i].spec.template.spec.domain.cpu["cores"];
                    currentVm.sockets = vms[i].spec.template.spec.domain.cpu["sockets"];
                    currentVm.threads = vms[i].spec.template.spec.domain.cpu["threads"];
                    currentVm.memory = vms[i].spec.template.spec.domain.resources.requests["memory"];
                } catch (e: any){
                    currentVm.cores = currentVm.cores || 0;
                    currentVm.sockets = currentVm.sockets || 0;
                    currentVm.threads = currentVm.threads || 0;
                    currentVm.memory = currentVm.memory || "N/A";
                    console.log("error getting custom vm cpu/memory");
                }

            } else {
                /* load vCPU / Mem from type */
                try {
                    const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(currentVm.instType));
                    currentVm.cores = data.spec.cpu["guest"];
                    currentVm.memory = data.spec.memory["guest"];
                    currentVm.sockets = 1;
                    currentVm.threads = 1;
                } catch (e: any) {
                    currentVm.sockets = 0;
                    currentVm.threads = 0;
                    currentVm.cores = 0;
                    currentVm.memory = "";
                    console.log("error loading instance type");
                }
            }

            if(vms[i].status["ready"] != null) {
                currentVm.ready = vms[i].status["ready"];
            }

            if(currentVm.running && currentVm.status && currentVm.status == "running") {
                let currentVmi = new KubeVirtVMI;
                try {
                    const datavmi = await lastValueFrom(this.kubeVirtService.getVMi(currentVm.namespace, currentVm.name));
                    currentVmi = new KubeVirtVMI();
                    currentVmi.name = datavmi.metadata["name"];
                    currentVmi.namespace = datavmi.metadata["namespace"];
                    currentVmi.creationTimestamp = new Date(datavmi.metadata["creationTimestamp"]);
                    currentVmi.osId = datavmi.status.guestOSInfo["id"];
                    currentVmi.osKernRel = datavmi.status.guestOSInfo["kernelRelease"];
                    currentVmi.osKernVer = datavmi.status.guestOSInfo["kernelVersion"];
                    currentVmi.osName = datavmi.status.guestOSInfo["name"];
                    currentVmi.osPrettyName = datavmi.status.guestOSInfo["prettyName"];
                    currentVmi.osVersion = datavmi.status.guestOSInfo["version"];

                    /* Only works with guest-agent installed if not on podNetwork */
                    try {
                        currentVm.nodeSel = datavmi.status["nodeName"];
                        /* In case of dual NIC, test which one is providing IP */
                        if(datavmi.status.interfaces[0]["ipAddress"] != null) {                        
                            currentVmi.ifAddr = datavmi.status.interfaces[0]["ipAddress"];
                            currentVmi.ifName = datavmi.status.interfaces[0]["name"];
                        } else {
                            currentVmi.ifAddr = datavmi.status.interfaces[1]["ipAddress"];
                            currentVmi.ifName = datavmi.status.interfaces[1]["name"];
                        }
                    } catch(e: any) {
                        currentVmi.ifAddr = "";
                        currentVmi.ifName = "";
                        console.log("error getting interface data");
                    }

                    currentVmi.nodeName = datavmi.status["nodeName"];
                    currentVm.vmi = currentVmi;
                } catch (e: any) {
                    console.log("ERROR Retrieving VMI: " + currentVm.name + "-" + currentVm.namespace + ":" + currentVm.status);
                }
            }
            this.vmList.push(currentVm);
        }
    }

    /*
     * Show New VM Window
     */
    async showNewVm(nodeName: string): Promise<void> {
        clearInterval(this.myInterval);
        let i = 0;
        let modalDiv = document.getElementById("modal-newvm");
        let modalTitle = document.getElementById("newvm-title");
        let modalBody = document.getElementById("newvm-value");

        let selectorNamespacesField = document.getElementById("newvm-namespace");
        let selectorTypeField = document.getElementById("newvm-type");
        let selectorPCField = document.getElementById("newvm-pc");
        let inputNewvmNode = document.getElementById("newvm-node");
        let selectorSCOneField = document.getElementById("newvm-diskonesc");
        let selectorSCTwoField = document.getElementById("newvm-disktwosc");

        let data: any;

        /* Set Node for VM */
        if(inputNewvmNode != null) {
            inputNewvmNode.setAttribute("value", nodeName);
        }

        /* Load Namespace List and Set Selector */
        let nsSelectorOptions = "";
        try {
            data = await lastValueFrom(this.k8sService.getNamespaces());
            for (i = 0; i < data.items.length; i++) {
                this.namespaceList.push(data.items[i].metadata["name"]);
                nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }

        /* Show new window
         * before loading everything
         * to avoid delays
         */
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Virtual Machine: " + nodeName);
        }
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade show");
            modalDiv.setAttribute("aria-modal", "true");
            modalDiv.setAttribute("role", "dialog");
            modalDiv.setAttribute("aria-hidden", "false");
            modalDiv.setAttribute("style","display: block;");
        }


        /* Load ClusterInstanceType List and Set Selector */
        let typeSelectorOptions = "<option value=none></option>";
        try {
            data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
            for (i = 0; i < data.items.length; i++) {
                typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }

        /* Load Priority Class List and Set Selector */
        let storageSelectorOptions = "";
        try {
            data = await lastValueFrom(this.k8sApisService.getStorageClasses());
            for (i = 0; i < data.items.length; i++) {
                storageSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }

        /* Load Storage Class List and Set Selector */
        let prioritySelectorOptions = "";
        try {
            data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
            for (i = 0; i < data.items.length; i++) {
                if(data.items[i].metadata["name"].toLowerCase() == "vm-standard") {
                    prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +" selected>" + data.items[i].metadata["name"] + "</option>\n";
                } else {
                    prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
                }
            }
        } catch (e: any) {
            console.log(e.error.message);
        }

        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        if (selectorTypeField != null) {
            typeSelectorOptions += "<option value=custom>custom</option>\n";
            selectorTypeField.innerHTML = typeSelectorOptions;
        }

        if (selectorSCOneField != null && selectorSCTwoField != null) {
            selectorSCOneField.innerHTML = storageSelectorOptions;
            selectorSCTwoField.innerHTML = storageSelectorOptions;
        }

        if (selectorPCField != null) {
            selectorPCField.innerHTML = prioritySelectorOptions;
        }

    }

    /*
     * New VM: Create the New VM
     */
    async applyNewVm(
        newvmname: string,
        newvmnamespace: string,
        newvmnode: string,
        newvmlabelkeyone: string,
        newvmlabelvalueone: string,
        newvmlabelkeytwo: string,
        newvmlabelvaluetwo: string,
        newvmlabelkeythree: string,
        newvmlabelvaluethree: string,
        newvmlabelkeyfour: string,
        newvmlabelvaluefour: string,
        newvmlabelkeyfive: string,
        newvmlabelvaluefive: string,
        newvmtype: string,
        newvmcpumemsockets: string,
        newvmcpumemcores: string,
        newvmcpumemthreads: string,
        newvmcpumemmemory: string,
        newvmpriorityclass: string,
        newvmfirmware: string,
        newvmsecureboot: string,
        newvmdiskonetype: string,
        newvmdiskonevalue: string,
        newvmdiskonesize: string,
        newvmdiskonesc: string,
        newvmdiskoneam: string,        
        newvmdiskonecm: string,
        newvmdisktwotype: string,
        newvmdisktwovalue: string,
        newvmdisktwosize: string,
        newvmdisktwosc: string,
        newvmdisktwoam: string,
        newvmdisktwocm: string,
        newvmnetworkone: string,
        newvmnetworktypeone: string,
        newvmnetworktwo: string,
        newvmnetworktypetwo: string,
        newvmuserdatausername: string,
        newvmuserdataauth: string,
        newvmuserdatapassword: string,
        newvmuserdatassh: string,
        newvmcloudinitip: string,
        newvmcloudinitnetmask: string,
        newvmcloudinitgw: string,
        newvmcloudinitdns1: string,
        newvmcloudinitdns2: string,
        newpoolinitscript: string
    ) {
        /* Basic Form Fields Check/Validation */
        if(newvmname == "" || newvmnamespace == "") {
            alert("You need to fill in the name and namespace fields!");
        } else if (newvmdiskonetype == "none") {
            alert("Your virtual machine needs at least the first disk!");
        } else if ((newvmdiskonetype == "blank" || newvmdiskonetype == "image") && newvmdiskonesize == "") {
            alert("You need to set a size for your Disk 1!");
        } else if ((newvmdiskonetype == "image" || newvmdiskonetype == "dv") && newvmdiskonevalue == "") {
            alert("You need to select the Disk 1!");
        } else if ((newvmdisktwotype == "blank" || newvmdisktwotype == "image") && newvmdisktwosize == "") {
            alert("You need to set a size for your Disk 2!");
        } else if ((newvmdisktwotype == "image" || newvmdisktwotype == "dv") && newvmdisktwovalue == "") {
            alert("You need to select the Disk 2!");
        } else if(this.checkVmExists(newvmname, newvmnamespace)) {
            alert("VM with name/namespace combination already exists!");
        } else if(newvmtype.toLowerCase() == "none" || newvmtype.toLowerCase() == "") {
            alert("Please select a valid VM type!");
        } else {

            let thisVirtualMachine: VirtualMachine = {
                apiVersion: "kubevirt.io/v1alpha3",
                kind: "VirtualMachine",
                metadata: {
                    name: newvmname,
                    namespace: newvmnamespace,
                },
                spec: {
                    running: false,
                    template: {
                        metadata: {},
                        spec: {
                            domain: {
                                devices: {
                                    disks: {},
                                    interfaces: {},
                                    networkInterfaceMultiqueue: true
                                }
                            },
                            networks: {},
                            volumes: {}
                        }
                    }
                }
            }

            /* Our Arrays */
            let networks = [];
            let disks = [];
            let interfaces = [];
            let volumes = [];

            /* Load Custom Labels  OPTIONAL */
            let tmpLabels = {};
            if(newvmlabelkeyone != "") {
                let thisLabel = {
                    [newvmlabelkeyone]: newvmlabelvalueone
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newvmlabelkeytwo != "") {
                let thisLabel = {
                    [newvmlabelkeytwo]: newvmlabelvaluetwo
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newvmlabelkeythree != "") {
                let thisLabel = {
                    [newvmlabelkeythree]: newvmlabelvaluethree
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newvmlabelkeyfour != "") {
                let thisLabel = {
                    [newvmlabelkeyfour]: newvmlabelvaluefour
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newvmlabelkeyfive != "") {
                let thisLabel = {
                    [newvmlabelkeyfive]: newvmlabelvaluefive
                };
                Object.assign(tmpLabels, thisLabel);
            }

            /* Populate our VM with our Labels */
            Object.assign(tmpLabels, { 'kubevirt.io/domain': newvmname });
            Object.assign(tmpLabels, { 'kubevirt-manager.io/managed': "true" });
            Object.assign(tmpLabels, { [this.firewallLabels.VirtualMachine]: newvmname });
            thisVirtualMachine.metadata.labels = tmpLabels;
            thisVirtualMachine.spec.template.metadata.labels = tmpLabels;


            /* Node Selector */
            if(newvmnode != "auto-select") {
                thisVirtualMachine.spec.template.spec.nodeSelector = {"kubernetes.io/hostname": newvmnode};
            }


            let cloudconfig  = "#cloud-config\n";
                cloudconfig += "manage_etc_hosts: true\n";
                cloudconfig += "hostname: " + newvmname + "\n";
                cloudconfig += "ssh_pwauth: true\n";
            let netconfig  ="version: 1\n";
                netconfig += "config:\n";
                netconfig += "    - type: physical\n";
                netconfig += "      name: enp1s0\n";
                netconfig += "      subnets:\n";

            /* Disk1 setup */
            let disk1name = newvmnamespace + "-"+ newvmname + "-disk1";
            let disk1 = {};
            let device1 = {};
            let dataVolumeOne: DataVolume = {
                apiVersion: "cdi.kubevirt.io/v1beta1",
                kind: "DataVolume",
                metadata: {
                    name: disk1name,
                    namespace: newvmnamespace,
                    annotations: {
                        "cdi.kubevirt.io/storage.deleteAfterCompletion": "false",
                    }
                },
                spec: {
                    pvc: {
                        storageClassName: newvmdiskonesc,
                        accessModes:[
                            newvmdiskoneam
                        ],
                        resources: {
                            requests: {
                                storage: newvmdiskonesize + "Gi",
                            }
                        }
                    },
                    source: {}
                }
            }
            if(newvmdiskonetype == "image") {
                try {
                    let imageData = await lastValueFrom(await this.kubevirtMgrService.getImage(newvmnamespace, newvmdiskonevalue));
                    switch(imageData.spec.type) {
                        case "http":
                            dataVolumeOne.spec.source = {
                                http: {
                                    url: imageData.spec.http.url
                                }
                            }
                            break;
                        case "gcs":
                            dataVolumeOne.spec.source = {
                                gcs: {
                                    url: imageData.spec.gcs.url
                                }
                            }
                            break;
                        case "s3":
                            dataVolumeOne.spec.source = {
                                s3: {
                                    url: imageData.spec.s3.url
                                }
                            }
                            break;
                        case "registry":
                            dataVolumeOne.spec.source = {
                                registry: {
                                    url: imageData.spec.registry.url
                                }
                            }
                            break;
                        case "pvc":
                            dataVolumeOne.spec.source = {
                                pvc: {
                                    name: imageData.spec.pvc.name,
                                    namespace: imageData.spec.pvc.namespace
                                }
                            }
                            break;
                    }
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                    throw new Error("Error loading Disk1 image data!");
                }
                try {
                    let disk1data = await lastValueFrom(this.dataVolumesService.createDataVolume(dataVolumeOne));
                    if(newvmdiskonecm != "") {
                        disk1 = { 'name': "disk1", 'cache': newvmdiskonecm, 'disk': {}};
                    } else {
                        disk1 = { 'name': "disk1", 'disk': {}};
                    }
                    device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}};
                    volumes.push(device1);
                    disks.push(disk1);
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                    throw new Error("Error creating Disk1 from Image!");
                }
            } else if (newvmdiskonetype == "blank") {
                dataVolumeOne.spec.source = {
                    blank: {}
                }
                try {
                    let disk1data = await lastValueFrom(this.dataVolumesService.createDataVolume(dataVolumeOne));
                    if(newvmdiskonecm != "") {
                        disk1 = { 'name': "disk1", 'cache': newvmdiskonecm, 'disk': {}};
                    } else {
                        disk1 = { 'name': "disk1", 'disk': {}};
                    }
                    device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}};
                    volumes.push(device1);
                    disks.push(disk1);
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                    throw new Error("Error creating Disk1 from Blank!");
                }
            } else if (newvmdiskonetype == "dv") {
                /* Use Existing DataVolume */
                if(newvmdiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newvmdiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': newvmdiskonevalue}};
                volumes.push(device1);
                disks.push(disk1);
            }

            /* Disk2 setup */
            if(newvmdisktwotype != "none") {
                let disk2name = newvmnamespace + "-"+ newvmname + "-disk2";
                let disk2 = {};
                let device2 = {};
                let dataVolumeTwo: DataVolume = {
                    apiVersion: "cdi.kubevirt.io/v1beta1",
                    kind: "DataVolume",
                    metadata: {
                        name: disk2name,
                        namespace: newvmnamespace,
                        annotations: {
                            "cdi.kubevirt.io/storage.deleteAfterCompletion": "false",
                        }
                    },
                    spec: {
                        pvc: {
                            storageClassName: newvmdisktwosc,
                            accessModes:[
                                newvmdisktwoam
                            ],
                            resources: {
                                requests: {
                                    storage: newvmdisktwosize + "Gi",
                                }
                            }
                        },
                        source: {}
                    }
                }
                if(newvmdisktwotype == "image") {
                    try {
                        let imageData = await lastValueFrom(await this.kubevirtMgrService.getImage(newvmnamespace, newvmdisktwovalue));
                        switch(imageData.spec.type) {
                            case "http":
                                dataVolumeTwo.spec.source = {
                                    http: {
                                        url: imageData.spec.http.url
                                    }
                                }
                                break;
                            case "gcs":
                                dataVolumeTwo.spec.source = {
                                    gcs: {
                                        url: imageData.spec.gcs.url
                                    }
                                }
                                break;
                            case "s3":
                                dataVolumeTwo.spec.source = {
                                    s3: {
                                        url: imageData.spec.s3.url
                                    }
                                }
                                break;
                            case "registry":
                                dataVolumeTwo.spec.source = {
                                    registry: {
                                        url: imageData.spec.registry.url
                                    }
                                }
                                break;
                            case "pvc":
                                dataVolumeTwo.spec.source = {
                                    pvc: {
                                        name: imageData.spec.pvc.name,
                                        namespace: imageData.spec.pvc.namespace
                                    }
                                }
                                break;
                        }
                    } catch (e: any) {
                        alert(e.error.message);
                        console.log(e.error.message);
                        throw new Error("Error loading Disk2 image data!");
                    }
                    try {
                        let disk2data = await lastValueFrom(this.dataVolumesService.createDataVolume(dataVolumeTwo));
                        if(newvmdisktwocm != "") {
                            disk2 = { 'name': "disk2", 'cache': newvmdisktwocm, 'disk': {}};
                        } else {
                            disk2 = { 'name': "disk2", 'disk': {}};
                        }
                        device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}};
                        volumes.push(device2);
                        disks.push(disk2);
                    } catch (e: any) {
                        alert(e.error.message);
                        console.log(e.error.message);
                        throw new Error("Error creating Disk2 from Image!");
                    }
                } else if (newvmdisktwotype == "blank") {
                    dataVolumeTwo.spec.source = {
                        blank: {}
                    }
                    try {
                        let disk2data = await lastValueFrom(this.dataVolumesService.createDataVolume(dataVolumeTwo));
                        if(newvmdisktwocm != "") {
                            disk2 = { 'name': "disk2", 'cache': newvmdisktwocm, 'disk': {}};
                        } else {
                            disk2 = { 'name': "disk2", 'disk': {}};
                        }
                        device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}};
                        volumes.push(device2);
                        disks.push(disk2);
                    } catch (e: any) {
                        alert(e.error.message);
                        console.log(e.error.message);
                        throw new Error("Error creating Disk2 from Blank!");
                    }
                } else if (newvmdisktwotype == "dv") {
                    /* Use Existing DataVolume */
                    if(newvmdisktwocm != "") {
                        disk2 = { 'name': "disk2", 'cache': newvmdisktwocm, 'disk': {}};
                    } else {
                        disk2 = { 'name': "disk2", 'disk': {}};
                    }
                    device2 = { 'name': "disk2", 'dataVolume': { 'name': newvmdisktwovalue}};
                    volumes.push(device2);
                    disks.push(disk2);
                }
            }

            /* UserData Setup */
            if(newvmuserdatausername != "") {
                Object.assign(thisVirtualMachine.metadata.labels, { "cloud-init.kubevirt-manager.io/username" : newvmuserdatausername });
                Object.assign(thisVirtualMachine.spec.template.metadata.labels, { "cloud-init.kubevirt-manager.io/username" : newvmuserdatausername });
            }
            if(newvmuserdataauth.toLowerCase() == "ssh") {
                if (newvmuserdatassh != "") {
                    let sshLabels = {};
                    Object.assign(sshLabels, { "kubevirt-manager.io/ssh" : "true" });
                    Object.assign(sshLabels, { "cloud-init.kubevirt-manager.io/ssh" : newvmuserdatassh});
                    Object.assign(thisVirtualMachine.metadata.labels, sshLabels);
                    try {
                        let sshSecret = await lastValueFrom(this.k8sService.getSecret(newvmnamespace, newvmuserdatassh));
                        let sshKey = sshSecret.data["ssh-privatekey"];
                        cloudconfig += "chpasswd:\n";
                        cloudconfig += "  expire: true\n";
                        cloudconfig += "users:\n";
                        cloudconfig += "  - name: " + newvmuserdatausername + "\n";
                        cloudconfig += "    lock_passwd: false\n";
                        cloudconfig += "    sudo: ALL=(ALL) NOPASSWD:ALL\n";
                        cloudconfig += "    shell: /bin/bash\n";
                        cloudconfig += "    ssh_authorized_keys:\n";
                        cloudconfig += "      - " + atob(sshKey) + "\n";
                    } catch (e: any) {
                        alert(e.error.message);
                        console.log(e.error.message);
                    }
                }
            } else {
                if (newvmuserdatapassword != "") {
                    cloudconfig += "chpasswd:\n";
                    cloudconfig += "  expire: true\n";
                    cloudconfig += "  users:\n";
                    cloudconfig += "    - {name: " + newvmuserdatausername + ", password: " + newvmuserdatapassword + ", type: text}\n"
                    cloudconfig += "users:\n";
                    cloudconfig += "  - name: " + newvmuserdatausername + "\n";
                    cloudconfig += "    lock_passwd: false\n";
                    cloudconfig += "    sudo: ALL=(ALL) NOPASSWD:ALL\n";
                    cloudconfig += "    shell: /bin/bash\n";
                    cloudconfig += "    plain_text_passwd: " + newvmuserdatapassword + "\n";
                }
            }

            /* Init Script Setup */
            if(newpoolinitscript != "") {
                cloudconfig += "runcmd: \n";
                for (const line of newpoolinitscript.split(/[\r\n]+/)){
                    cloudconfig += "  - " + line + "\n";
                }
            }

            /* NetworkData Setup */
            if(newvmcloudinitip != "") {
                netconfig += "      - type: static\n";
                netconfig += "        address: \'" + newvmcloudinitip + "\'\n";
                netconfig += "        netmask: \'" + newvmcloudinitnetmask + "\'\n";
                netconfig += "        gateway: \'" + newvmcloudinitgw + "\'\n";
            } else {
                netconfig += "      - type: dhcp\n";
            }

            /* NetworkData Setup: DNS */
            if(newvmcloudinitdns1 != "") {
                netconfig += "    - type: nameserver\n";
                netconfig += "      address:\n";
                netconfig += "      - \'" + newvmcloudinitdns1 + "\'\n";
                if (newvmcloudinitdns2 != "") {
                netconfig += "      - \'" + newvmcloudinitdns2 + "\'\n";
                }
            } else {
                netconfig += "    - type: nameserver\n";
                netconfig += "      address:\n";
                netconfig += "      - \'8.8.8.8\'\n";
                netconfig += "      - \'8.8.4.4\'\n";
            }

            /* Adding UserData/NetworkData device */
            let disk3 = {'name': "disk3", 'disk': {'bus': "virtio"}};
            let device3 = {'name': "disk3", 'cloudInitNoCloud': {'userData': cloudconfig, 'networkData': netconfig}};
            volumes.push(device3);
            disks.push(disk3);
        

            /* NIC01 Setup */
            let net1 = {};
            let iface1 = {};
            if(newvmnetworkone != "podNetwork") {
                net1 = {'name': "net1", 'multus': {'networkName': newvmnetworkone}};
                Object.assign(thisVirtualMachine.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworkone});
                Object.assign(thisVirtualMachine.spec.template.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworkone});
            } else {
                net1 = {'name': "net1", 'pod': {}};
            }
            networks.push(net1);
            if(newvmnetworktypeone == "bridge") {
                iface1 = {'name': "net1", 'bridge': {}};    
            } else {
                iface1 = {'name': "net1", 'masquerade': {}};
            }
            interfaces.push(iface1);


            /* NIC02 Setup */
            if(newvmnetworktwo != "none") {
                let net2 = {};
                let iface2 = {};
                if(newvmnetworktwo != "podNetwork") {
                    net2 = {'name': "net2", 'multus': {'networkName': newvmnetworktwo}};
                    if(newvmnetworkone != "podNetwork") {
                        Object.assign(thisVirtualMachine.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworkone, newvmnetworktwo});
                        Object.assign(thisVirtualMachine.spec.template.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworkone, newvmnetworktwo});
                    } else {
                        Object.assign(thisVirtualMachine.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworktwo});
                        Object.assign(thisVirtualMachine.spec.template.metadata.labels, { 'k8s.v1.cni.cncf.io/networks': newvmnetworktwo});
                    }
                } else {
                    net2 = {'name': "net2", 'pod': {}};
                }
                networks.push(net2);
                if(newvmnetworktypetwo == "bridge") {
                    iface2 = {'name': "net2", 'bridge': {}};
                } else {
                    iface2 = {'name': "net2", 'masquerade': {}};
                }
                interfaces.push(iface2);
            }

            /* Assigning Arrays */
            if(networks.length > 0) { thisVirtualMachine.spec.template.spec.networks = networks; }
            if(disks.length > 0) { thisVirtualMachine.spec.template.spec.domain.devices.disks = disks; }
            if(interfaces.length > 0) { thisVirtualMachine.spec.template.spec.domain.devices.interfaces = interfaces; }
            if(volumes.length > 0) { thisVirtualMachine.spec.template.spec.volumes = volumes; }

            /* Firmware and Secure Boot */
            if(newvmfirmware.toLowerCase() == "bios") {
                let firmware = { 'bootloader': { 'bios': {}}};
                thisVirtualMachine.spec.template.spec.domain.firmware = firmware;
            } else if (newvmfirmware.toLowerCase() == "uefi") {
                let firmware = {};
                if(newvmsecureboot == "true") {
                    firmware = { 'bootloader': { 'efi': { 'secureBoot': true }}};
                } else {
                    firmware = { 'bootloader': { 'efi': { 'secureBoot': false }}};
                }
                let features = { 'smm': { 'enabled': true }};
                thisVirtualMachine.spec.template.spec.domain.firmware = firmware;
                thisVirtualMachine.spec.template.spec.domain.features = features;
            } else {
                let firmware = { 'bootloader': { 'bios': {}}};
                thisVirtualMachine.spec.template.spec.domain.firmware = firmware;
            }

            /* Create the VM */
            if(newvmtype.toLowerCase() == "custom") {
                thisVirtualMachine.spec.template.spec.domain.cpu = {
                    cores: Number(newvmcpumemcores),
                    threads: Number(newvmcpumemthreads),
                    sockets: Number(newvmcpumemsockets)
                };
                thisVirtualMachine.spec.template.spec.domain.resources = {
                    requests: {
                        memory: newvmcpumemmemory + "Gi"
                    }
                };
            } else {
                thisVirtualMachine.spec.template.spec.priorityClassName = newvmpriorityclass;
                thisVirtualMachine.spec.instancetype = {  
                    kind: "VirtualMachineClusterInstancetype",
                    name: newvmtype
                };
            }
            try {
                let data = await lastValueFrom(this.kubeVirtService.createVm(thisVirtualMachine));
                this.hideComponent("modal-newvm");
                this.fullReload();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e.error.message);
            }
        }
    }

    /*
     * Show Resize Window
     */
    showResize(vmName: string, vmNamespace: string, vmSockets: number, vmCores: number, vmThreads: number, vmMemory: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-resize");
        let modalTitle = document.getElementById("resize-title");
        let modalBody = document.getElementById("resize-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Resize: " + vmName);
        }
        if(modalBody != null) {
            let resizeNameField = document.getElementById("resize-name");
            let resizeNamespaceField = document.getElementById("resize-namespace");
            let resizeSocketsField = document.getElementById("resize-sockets");
            let resizeCoresField = document.getElementById("resize-cores");
            let resizeThreadsField = document.getElementById("resize-threads");
            let resizeMemoryField = document.getElementById("resize-memory");
            if(resizeNameField != null && resizeNamespaceField != null && resizeSocketsField != null && resizeCoresField != null && resizeThreadsField != null && resizeMemoryField != null) {
                resizeNameField.setAttribute("value", vmName);
                resizeNamespaceField.setAttribute("value", vmNamespace);
                resizeSocketsField.setAttribute("placeholder", vmSockets.toString());
                resizeCoresField.setAttribute("placeholder", vmCores.toString());
                resizeThreadsField.setAttribute("placeholder", vmThreads.toString());
                resizeMemoryField.setAttribute("placeholder", vmMemory.toString());
                resizeSocketsField.setAttribute("value", vmSockets.toString());
                resizeCoresField.setAttribute("value", vmCores.toString());
                resizeThreadsField.setAttribute("value", vmThreads.toString());
                resizeMemoryField.setAttribute("value", vmMemory.replace("Gi", "").toString());
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
     * Resize Virtual Machine
     */
    async applyResize(sockets: string, cores: string, threads: string, memory: string): Promise<void> {
        let resizeNameField = document.getElementById("resize-name");
        let resizeNamespaceField = document.getElementById("resize-namespace");
        if(sockets != "" && cores != "" && threads != "" && memory != "" && resizeNameField != null && resizeNamespaceField != null) {
            let resizeName = resizeNameField.getAttribute("value");
            let resizeNamespace = resizeNamespaceField.getAttribute("value");
            if(resizeName != null && resizeNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.scaleVm(resizeNamespace, resizeName, cores, threads, sockets, memory));
                    this.hideComponent("modal-resize");
                    this.fullReload();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                }
            }
        }
    }

    /*
     * Show Delete Window
     */
    showDelete(vmName: string, vmNamespace: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let vmNameInput = document.getElementById("delete-name");
            let vmNamespaceInput = document.getElementById("delete-namespace");
            if(vmNameInput != null && vmNamespaceInput != null) {
                vmNameInput.setAttribute("value", vmName);
                vmNamespaceInput.setAttribute("value", vmNamespace);
                modalBody.replaceChildren("Are you sure you want to delete " + vmName + " on namespace: " + vmNamespace + "?");
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
     * Delete Virtual Machine
     */
    async applyDelete(): Promise<void> {
        let vmNameInput = document.getElementById("delete-name");
        let vmNamespaceInput = document.getElementById("delete-namespace");
        if(vmNameInput != null && vmNamespaceInput != null) {
            let vmName = vmNameInput.getAttribute("value");
            let vmNamespace = vmNamespaceInput.getAttribute("value");
            if(vmName != null && vmNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
                    this.hideComponent("modal-delete");
                    this.fullReload();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                }
            }
        }
    }


    /*
     * Show Type Window
     */
    async showType(vmName: string, vmNamespace: string): Promise<void> {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-type");
        let modalTitle = document.getElementById("type-title");
        let modalBody = document.getElementById("type-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Change VM Type");
        }
        if(modalBody != null) {
            let vmNameInput = document.getElementById("type-vm");
            let vmNamespaceInput = document.getElementById("type-namespace");
            let selectorTypeFiled = document.getElementById("changevm-type");
            if(vmNameInput != null && vmNamespaceInput != null) {
                vmNameInput.setAttribute("value", vmName);
                vmNamespaceInput.setAttribute("value", vmNamespace);
                /* Load ClusterInstanceTyle List and Set Selector */
                let typeSelectorOptions = "";
                let data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
                for (let i = 0; i < data.items.length; i++) {
                    typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
                }
                if (selectorTypeFiled != null) {
                    selectorTypeFiled.innerHTML = typeSelectorOptions;
                }
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
     * Change VM Type
     */
    async applyType(vmType: string): Promise<void> {
        let vmNameInput = document.getElementById("type-vm");
        let vmNamespaceInput = document.getElementById("type-namespace");
        if(vmNameInput != null && vmNamespaceInput != null) {
            let vmName = vmNameInput.getAttribute("value");
            let vmNamespace = vmNamespaceInput.getAttribute("value");
            if(vmName != null && vmNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.changeVmType(vmNamespace, vmName, vmType));
                    this.hideComponent("modal-type");
                    this.fullReload();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e.error.message);
                }
            }
        }
    }

    /*
     * VM Basic Operations (start, stop, etc...)
     */
    async vmOperations(vmOperation: string, vmNamespace: string, vmName: string): Promise<void> {
        clearInterval(this.myInterval);
        if(vmOperation == "start"){
            var data = await lastValueFrom(this.kubeVirtService.startVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "stop") {
            var data = await lastValueFrom(this.kubeVirtService.stopVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "reboot"){
            var data = await lastValueFrom(this.kubeVirtService.restartVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "pause") {
            const data = await lastValueFrom(this.kubeVirtService.pauseVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "unpause") {
            const data = await lastValueFrom(this.kubeVirtService.unpauseVm(vmNamespace, vmName));
            this.reloadComponent();
        } else if (vmOperation == "delete") {
            const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
            this.reloadComponent();
        }
    }

    /*
     * New VM: Change Firmware
     */
    async onChangeFirmware(firmware: string) {
        let secureBootValueField = document.getElementById("newvm-secureboot");
        if(firmware == "uefi") {
            if (secureBootValueField != null) {
                secureBootValueField.removeAttribute("disabled");
            }
        } else if (firmware == "bios") {
            if (secureBootValueField != null) {
                secureBootValueField.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New VM: Control Disk1 Options
     */
    async onChangeDiskOne(diskType: string, diskNamespace: string) {
        let diskOneValueField = document.getElementById("newvm-diskonevalue");
        let diskOneSizeField = document.getElementById("newvm-diskonesize");
        if(diskType == "none") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "blank") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.removeAttribute("disabled");
            }
        } else if (diskType == "image") {
            if(diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.innerHTML = await this.loadImageOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.removeAttribute("disabled");
            }
        } else if (diskType == "dv") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New VM: Control Disk2 Options
     */
    async onChangeDiskTwo(diskType: string, diskNamespace: string) {
        let diskTwoValueField = document.getElementById("newvm-disktwovalue");
        let diskTwoSizeField = document.getElementById("newvm-disktwosize");
        if(diskType == "none") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "blank") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
        } else if (diskType == "image") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.innerHTML = await this.loadImageOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
        } else if (diskType == "dv") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New VM: Load Image Options
     */
    async loadPVCOptions(dvNamespace: string){
        let pvcSelectorOptions = "";
        try {
            let data = await lastValueFrom(this.k8sService.getNamespacedPersistentVolumeClaims(dvNamespace));
            let pvcs = data.items;
            for (let i = 0; i < pvcs.length; i++) {
                pvcSelectorOptions += "<option value=" + pvcs[i].metadata["name"] +">" + pvcs[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }
        return pvcSelectorOptions;
    }

    /*
     * New VM: Load Disk Options
     */
    async loadDiskOptions(dvNamespace: string) {
        let diskSelectorOptions = "";
        try {
            let data = await lastValueFrom(await this.dataVolumesService.getNamespacedDataVolumes(dvNamespace));
            let disks = data.items;
            for (let i = 0; i < disks.length; i++) {

                diskSelectorOptions += "<option value=" + disks[i].metadata["name"] +">" + disks[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }
        return diskSelectorOptions;
    }

    /*
     * New VM: Load Image Options
     */
    async loadImageOptions(imgNamespace: string) {
        let imgSelectorOptions = "";
        try {
            let data = await lastValueFrom(await this.kubevirtMgrService.getNamespacedImages(imgNamespace));
            let images = data.items;
            for (let i = 0; i < images.length; i++) {

                imgSelectorOptions += "<option value=" + images[i].metadata["name"] +">" + images[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e.error.message);
        }
        return imgSelectorOptions;
    }

    /*
     * New VM: Load Network Options
     */
    async onChangeNamespace(namespace: string) {
        let selectorNetworkFieldOne = document.getElementById("newvm-networkone");
        let selectorNetworkFieldTwo = document.getElementById("newvm-networktwo");
        let selectorDiskOneType = document.getElementById("newvm-diskonetype");
        let selectorDiskTwoType = document.getElementById("newvm-disktwotype");
        let selectorDiskOneValue = document.getElementById("newvm-diskonevalue");
        let fieldDiskOneSize = document.getElementById("newvm-diskonesize");
        let selectorDiskTwoValue = document.getElementById("newvm-disktwovalue");
        let fieldDiskTwoSize = document.getElementById("newvm-disktwosize");
        let selectorAuthType = document.getElementById("newvm-userdata-auth");
        let selectorSSHKey = document.getElementById("newvm-userdata-ssh");
        let netData = document.getElementById("newvm-netdata-tab");
        let networkSelectorOptions = "<option value=podNetwork>podNetwork</option>\n";

        /* Set Networking options */
        if(this.networkCheck) {
            let data = await lastValueFrom(this.k8sApisService.getNetworkAttachs());
            let netAttach = data.items;
            for (let i = 0; i < netAttach.length; i++) {
                if(namespace == netAttach[i].metadata["namespace"]) {
                    let currentAttach = new NetworkAttach();
                    currentAttach.name = netAttach[i].metadata["name"];
                    currentAttach.namespace = netAttach[i].metadata["namespace"];
                    currentAttach.config = JSON.parse(netAttach[i].spec["config"]);
                    this.netAttachList.push(currentAttach);
                    networkSelectorOptions += "<option value=" + netAttach[i].metadata["name"] + ">" + netAttach[i].metadata["name"] + "</option>\n";
                }
            }
        }
        if (selectorNetworkFieldOne != null && selectorNetworkFieldTwo != null && networkSelectorOptions != "") {
            selectorNetworkFieldOne.innerHTML = networkSelectorOptions;
            selectorNetworkFieldTwo.innerHTML = "<option value=none>None</option>\n" + networkSelectorOptions;
        }
        if (netData != null) {
            netData.setAttribute("style","display: none;");
        }

        /* Reset disk options */
        if(selectorDiskOneType != null && selectorDiskTwoType != null && selectorDiskOneValue != null && selectorDiskTwoValue) {
            let diskOptions = "<option value=none>None</option>\n<option value=blank>Blank Disk</option>\n<option value=image>Image</option>\n<option value=dv>DataVolume</option>";
            selectorDiskOneType.innerHTML = diskOptions;
            selectorDiskTwoType.innerHTML = diskOptions;
            selectorDiskOneValue.innerHTML = "";
            selectorDiskTwoValue.innerHTML = "";
            selectorDiskOneValue.setAttribute("disabled", "disabled");
            selectorDiskTwoValue.setAttribute("disabled", "disabled");
        }

        if(fieldDiskOneSize != null && fieldDiskTwoSize != null) {
            fieldDiskOneSize.setAttribute("disabled", "disabled");
            fieldDiskTwoSize.setAttribute("disabled", "disabled");
        }

        /* Reset SSH Key Options */
        if(selectorAuthType != null && selectorSSHKey != null) {
            let authOptions = "<option value=password>User/Password</option>\n<option value=ssh>SSH Private Key</option>";
            selectorAuthType.innerHTML = "";
            selectorSSHKey.innerHTML = "";
            selectorAuthType.innerHTML = authOptions;
            this.onChangeAuthType("password", namespace);
        }
    }

    /*
     * New VM: Display Custom CPU/MEM
     */
    async onChangeType(vmType: string) {
        let modalDiv = document.getElementById("custom-cpu-memory");
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
     * New VM: Change between pass/ssh auth
     */
    async onChangeAuthType(authType: string, namespace: string) {
        let modalSSHDiv = document.getElementById("newvm-userdata-ssh-panel");
        let modelPWDDiv = document.getElementById("newvm-userdata-password-panel");
        if(authType.toLowerCase() == "ssh") {
            let sshKeySelector = document.getElementById("newvm-userdata-ssh");
            if (sshKeySelector != null) {
                let data = await lastValueFrom(await this.k8sService.getSSHSecretsNamespaced(namespace));
                let keyList = data.items;
                let sshSelectorOptions = "";
                for(let i = 0; i < keyList.length; i++) {
                    sshSelectorOptions += "<option value=" + keyList[i].metadata["name"] + ">" + keyList[i].metadata["name"] + "</option>\n";
                }
                sshKeySelector.innerHTML = sshSelectorOptions;

            }
            if(modalSSHDiv != null && modelPWDDiv != null) {
                modalSSHDiv.setAttribute("class", "modal fade show");
                modalSSHDiv.setAttribute("aria-modal", "true");
                modalSSHDiv.setAttribute("role", "dialog");
                modalSSHDiv.setAttribute("aria-hidden", "false");
                modalSSHDiv.setAttribute("style","display: contents;");
                modelPWDDiv.setAttribute("class", "modal fade");
                modelPWDDiv.setAttribute("aria-modal", "false");
                modelPWDDiv.setAttribute("role", "");
                modelPWDDiv.setAttribute("aria-hidden", "true");
                modelPWDDiv.setAttribute("style","display: none;");
            }
        } else {
            if(modalSSHDiv != null && modelPWDDiv != null) {
                modelPWDDiv.setAttribute("class", "modal fade show");
                modelPWDDiv.setAttribute("aria-modal", "true");
                modelPWDDiv.setAttribute("role", "dialog");
                modelPWDDiv.setAttribute("aria-hidden", "false");
                modelPWDDiv.setAttribute("style","display: contents;");
                modalSSHDiv.setAttribute("class", "modal fade");
                modalSSHDiv.setAttribute("aria-modal", "false");
                modalSSHDiv.setAttribute("role", "");
                modalSSHDiv.setAttribute("aria-hidden", "true");
                modalSSHDiv.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * New VM: Change network (hide/show metadata tab)
     */
    async onChangeNetworkOne(thisNetwork: string) {
        let netData = document.getElementById("newvm-netdata-tab");
        let selectorNetworkTypeField = document.getElementById("newvm-networktypeone");
        let networkTypeSelectorOptions = "<option value=bridge>bridge</option>\n";
        if(netData != null && thisNetwork.toLowerCase() != "podnetwork") {
            netData.setAttribute("style","display: flex;");

        } else {
            networkTypeSelectorOptions += "<option value=masquerade>masquerade</option>\n";
            if(netData != null && thisNetwork.toLowerCase() == "podnetwork") {
                netData.setAttribute("style","display: none;");
            }
        }

        if(selectorNetworkTypeField != null) {
            selectorNetworkTypeField.innerHTML = networkTypeSelectorOptions;
        }
    }

    /*
     * New VM: Change network (hide/show metadata tab)
     */
    async onChangeNetworkTwo(thisNetwork: string) {
        let selectorNetworkTypeField = document.getElementById("newvm-networktypetwo");
        let networkTypeSelectorOptions = "<option value=bridge>bridge</option>\n";
        if(thisNetwork.toLowerCase() == "podnetwork") {
            networkTypeSelectorOptions += "<option value=masquerade>masquerade</option>\n";
        }

        if(selectorNetworkTypeField != null) {
            selectorNetworkTypeField.innerHTML = networkTypeSelectorOptions;
        }
    }

    /*
     * Check VM Exists
     */
    checkVmExists(vmname: string, vmnamespace:string): boolean {
        for (let i = 0; i < this.vmList.length; i++) {
            if(this.vmList[i].name == vmname && this.vmList[i].namespace == vmnamespace) {
                return true;
            }
        }
        return false;
    }

    /*
     * Check Multus Support
     */
    async checkNetwork(): Promise<void> {
        try {
            const data = await lastValueFrom(this.k8sApisService.getCrds());
            let crds = data.items;
            for (let i = 0; i < crds.length; i++) {
                if(crds[i].metadata["name"] == "network-attachment-definitions.k8s.cni.cncf.io") {
                    this.networkCheck = true;
                }
            }
        } catch (e: any) {
            console.log(e.error.message);
        }
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
     * Open NoVNC
     */
    openNoVNC(namespace: string, name: string): void {
        let url = "/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=";
        let path = "/k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
        let fullpath = url + path;
        window.open(fullpath, "kubevirt-manager.io: CONSOLE", "width=800,height=600,location=no,toolbar=no,menubar=no,resizable=yes");
    }

    /*
     * Reload this component
     */
    async reloadComponent(): Promise<void> {
        await this.getVMs();
        await this.getNodes();
        this.cdRef.detectChanges();
    }

    /*
     * Full Reload
     */
    fullReload(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmlist`]);
        })
    }
}
