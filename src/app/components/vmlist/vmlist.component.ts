import { Component, OnInit } from '@angular/core';
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
import { ExpressionType } from '@angular/compiler';


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

    myVmTemplateTyped = {
        'apiVersion': "kubevirt.io/v1alpha3",
        'kind': "VirtualMachine",
        'metadata':{
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'instancetype': {
                'kind': "VirtualMachineClusterInstancetype",
                'name': ""
            },
            'running' : false,
            'template':{
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'nodeSelector':{},
                    'priorityClassName': "",
                    'domain': {
                        'devices': {
                            'disks':[{}],
                            'interfaces': [{}]
                        },
                    },
                    'networks':[{}],
                    'volumes':[{}]
                }
            }
        }
    };

    myVmTemplateCustom = {
        'apiVersion': "kubevirt.io/v1alpha3",
        'kind': "VirtualMachine",
        'metadata':{
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'running' : false,
            'template':{
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'nodeSelector':{},
                    'priorityClassName': "",
                    'domain': {
                        'cpu': {
                            'sockets': 0,
                            'threads': 0,
                            'cores': 0
                        },
                        'devices': {
                            'disks':[{}],
                            'interfaces': [{}]
                        },
                        'resources': {
                            'requests': {
                                'memory': ""
                            }
                        }
                    },
                    'networks':[{}],
                    'volumes':[{}]
                }
            }
        }
    };

    constructor(
        private k8sService: K8sService,
        private router: Router,
        private dataVolumesService: DataVolumesService,
        private k8sApisService: K8sApisService,
        private kubeVirtService: KubeVirtService
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

    /*
     * Load Nodes
     */
    async getNodes(): Promise<void> {
        let currentNode = new K8sNode;
        const data = await lastValueFrom(this.k8sService.getNodes());
        let nodes = data.items;
        for (let i = 0; i < nodes.length; i++) {
            currentNode = new K8sNode();
            currentNode.name = nodes[i].metadata["name"];
            currentNode.arch = nodes[i].status.nodeInfo["architecture"];
            currentNode.cidr = nodes[i].spec["podCIDR"];
            currentNode.mem = nodes[i].status.capacity["memory"];
            currentNode.disk = nodes[i].status.capacity["ephemeral-storage"];
            currentNode.cpu = nodes[i].status.capacity["cpu"];
            currentNode.os = nodes[i].status.nodeInfo["operatingSystem"];
            currentNode.osimg = nodes[i].status.nodeInfo["osImage"];
            currentNode.kernel = nodes[i].status.nodeInfo["kernelVersion"];
            currentNode.criver = nodes[i].status.nodeInfo["containerRuntimeVersion"];
            currentNode.kubever = nodes[i].status.nodeInfo["kubeletVersion"];
            for(let j = 0; j < this.vmList.length; j++) {
                if (this.vmList[j].nodeSel == currentNode.name)
                    currentNode.vmlist.push(this.vmList[j]);
            }
            this.nodeList.push(currentNode);
        }
    }

    /*
     * Load VM List
     */
    async getVMs(): Promise<void> {
        let currentVm = new KubeVirtVM;
        const data = await lastValueFrom(this.kubeVirtService.getVMs());
        let vms = data.items;
        for (let i = 0; i < vms.length; i++) {
            currentVm = new KubeVirtVM();
            currentVm.name = vms[i].metadata["name"];
            currentVm.namespace = vms[i].metadata["namespace"];
            currentVm.running = vms[i].spec["running"];
            currentVm.status = vms[i].status["printableStatus"];
            try {
                currentVm.nodeSel = vms[i].spec.template.spec.nodeSelector["kubernetes.io/hostname"];
            } catch (e) {
                currentVm.nodeSel = "unassigned";
            }

            /* Getting VM Type */
            try {
                currentVm.instType = vms[i].spec.instancetype.name;
            } catch(e) {
                currentVm.instType = "custom";
            }

            if(currentVm.instType == "custom") {
                /* Custom VM has cpu / mem parameters */
                currentVm.cores = vms[i].spec.template.spec.domain.cpu["cores"];
                currentVm.sockets = vms[i].spec.template.spec.domain.cpu["sockets"];
                currentVm.threads = vms[i].spec.template.spec.domain.cpu["threads"];
                currentVm.memory = vms[i].spec.template.spec.domain.resources.requests["memory"];
            } else {
                /* load vCPU / Mem from type */
                try {
                    const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(currentVm.instType));
                    currentVm.cores = data.spec.cpu["guest"];
                    currentVm.memory = data.spec.memory["guest"];
                    currentVm.sockets = 1;
                    currentVm.threads = 1;
                } catch (e) {
                    currentVm.sockets = 0;
                    currentVm.threads = 0;
                    currentVm.cores = 0;
                    currentVm.memory = "";
                }
            }

            if(currentVm.running && currentVm.status && vms[i].status["printableStatus"].toLowerCase() == "running") {
                let currentVmi = new KubeVirtVMI;
                try {
                    const datavmi = await lastValueFrom(this.kubeVirtService.getVMi(currentVm.namespace, currentVm.name));
                    currentVmi = new KubeVirtVMI();
                    currentVmi.name = datavmi.metadata["name"];
                    currentVmi.namespace = datavmi.metadata["namespace"];
                    currentVmi.osId = datavmi.status.guestOSInfo["id"]
                    currentVmi.osKernRel = datavmi.status.guestOSInfo["kernelRelease"]
                    currentVmi.osKernVer = datavmi.status.guestOSInfo["kernelVersion"]
                    currentVmi.osName = datavmi.status.guestOSInfo["name"]
                    currentVmi.osPrettyName = datavmi.status.guestOSInfo["prettyName"];
                    currentVmi.osVersion = datavmi.status.guestOSInfo["version"]

                    /* Only works with guest-agent installed */
                    try {
                        currentVm.nodeSel = datavmi.status["nodeName"];
                        currentVmi.ifAddr = datavmi.status.interfaces[0]["ipAddress"];
                        currentVmi.ifName = datavmi.status.interfaces[0]["name"];
                    } catch(e) {
                        currentVmi.ifAddr = "";
                        currentVmi.ifName = "";
                    }

                    currentVmi.nodeName = datavmi.status["nodeName"];
                    currentVm.vmi = currentVmi;
                } catch (e) {
                    console.log(e);
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

        /* Set Node for VM */
        if(inputNewvmNode != null) {
            inputNewvmNode.setAttribute("value", nodeName);
        }

        /* Load Namespace List and Set Selector */
        let data = await lastValueFrom(this.k8sService.getNamespaces());
        let nsSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            this.namespaceList.push(data.items[i].metadata["name"]);
            nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        /* Load ClusterInstanceType List and Set Selector */
        data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        let typeSelectorOptions = "<option value=none></option>";
        for (i = 0; i < data.items.length; i++) {
            typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorTypeField != null) {
            typeSelectorOptions += "<option value=custom>custom</option>\n";
            selectorTypeField.innerHTML = typeSelectorOptions;
        }

        /* Load Priority Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getStorageClasses());
        let storageSelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            storageSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorSCOneField != null && selectorSCTwoField != null) {
            selectorSCOneField.innerHTML = storageSelectorOptions;
            selectorSCTwoField.innerHTML = storageSelectorOptions;
        }

        /* Load Storage Class List and Set Selector */
        data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
        let prioritySelectorOptions = "";
        for (i = 0; i < data.items.length; i++) {
            if(data.items[i].metadata["name"].toLowerCase() == "vm-standard") {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +" selected>" + data.items[i].metadata["name"] + "</option>\n";
            } else {
                prioritySelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        }
        if (selectorPCField != null) {
            selectorPCField.innerHTML = prioritySelectorOptions;
        }

        if(modalTitle != null) {
            modalTitle.replaceChildren("New Virtual Machine: " + nodeName);
        }

        /* Clean up devices */
        while(this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.length > 0) {
            this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.pop();
        }
        while(this.myVmTemplateCustom.spec.template.spec.volumes.length > 0){
            this.myVmTemplateCustom.spec.template.spec.volumes.pop();
        }
        while(this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.length > 0) {
            this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.pop();
        }
        while(this.myVmTemplateTyped.spec.template.spec.volumes.length > 0){
            this.myVmTemplateTyped.spec.template.spec.volumes.pop();
        }

        /* Clean up networks */
        while(this.myVmTemplateCustom.spec.template.spec.networks.length > 0){
            this.myVmTemplateCustom.spec.template.spec.networks.pop();
        }
        while(this.myVmTemplateCustom.spec.template.spec.domain.devices.interfaces.length > 0) {
            this.myVmTemplateCustom.spec.template.spec.domain.devices.interfaces.pop();
        }
        while(this.myVmTemplateTyped.spec.template.spec.networks.length > 0){
            this.myVmTemplateTyped.spec.template.spec.networks.pop();
        }
        while(this.myVmTemplateTyped.spec.template.spec.domain.devices.interfaces.length > 0) {
            this.myVmTemplateTyped.spec.template.spec.domain.devices.interfaces.pop();
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
     * Hide New VM Window
     */
    hideNewVm(): void {
        let modalDiv = document.getElementById("modal-newvm");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
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
        newvmdiskonetype: string,
        newvmdiskonevalue: string,
        newvmdiskonesize: string,
        newvmdiskonesc: string,
        newvmdiskoneurl: string,
        newvmdisktwotype: string,
        newvmdisktwovalue: string,
        newvmdisktwosize: string,
        newvmdisktwosc: string,
        newvmdisktwourl: string,
        newvmnetwork: string,
        newvmcloudinitusername: string,
        newvmcloudinitpassword: string,
        newvmcloudinitip: string,
        newvmcloudinitnetmask: string,
        newvmcloudinitgw: string,
        newvmcloudinitdns1: string,
        newvmcloudinitdns2: string
    ) {
        /* Basic Form Fields Check/Validation */
        if(newvmname == "" || newvmnamespace == "") {
            alert("You need to fill in the name and namespace fields!");
        } else if (newvmdiskonetype == "none") {
            alert("Your virtual machine needs at least the first disk!");
        } else if ((newvmdiskonetype == "blank" || newvmdiskonetype == "image") && newvmdiskonesize == "") {
            alert("You need to set a size for your disk!");
        } else if (newvmdiskonetype == "image" && newvmdiskoneurl == "") {
            alert("You need to select a source image for your disk!");
        } else if (newvmdiskonetype == "disk" && newvmdiskonevalue == "") {
            alert("You need to select the disk!");
        } else if ((newvmdisktwotype == "blank" || newvmdisktwotype == "image") && newvmdisktwosize == "") {
            alert("You need to set a size for your disk!");
        } else if (newvmdisktwotype == "image" && newvmdisktwourl == "") {
            alert("You need to select a source image for your disk!");
        } else if (newvmdisktwotype == "disk" && newvmdisktwovalue == "") {
            alert("You need to select the disk!");
        } else if(this.checkVmExists(newvmname, newvmnamespace)) {
            alert("VM with name/namespace combination already exists!");
        } else if(newvmtype.toLowerCase() == "none" || newvmtype.toLocaleLowerCase() == "") {
            alert("Please select a valid VM type!");
        } else {

            /* Load Custom Labels */
            let tmpLabels = [{}];
            tmpLabels.pop();
            if(newvmlabelkeyone != "") {
                let thisLabel = {
                    [newvmlabelkeyone]: newvmlabelvalueone
                };
                tmpLabels.push(thisLabel);
            }
            if(newvmlabelkeytwo != "") {
                let thisLabel = {
                    [newvmlabelkeytwo]: newvmlabelvaluetwo
                };
                tmpLabels.push(thisLabel);
            }
            if(newvmlabelkeythree != "") {
                let thisLabel = {
                    [newvmlabelkeythree]: newvmlabelvaluethree
                };
                tmpLabels.push(thisLabel);
            }
            if(newvmlabelkeyfour != "") {
                let thisLabel = {
                    [newvmlabelkeyfour]: newvmlabelvaluefour
                };
                tmpLabels.push(thisLabel);
            }
            if(newvmlabelkeyfive != "") {
                let thisLabel = {
                    [newvmlabelkeyfive]: newvmlabelvaluefive
                };
                tmpLabels.push(thisLabel);
            }

            /* Load other labels */
            let thisLabel = {'kubevirt.io/domain': newvmname};
            tmpLabels.push(thisLabel);

            /* Check VM Type */
            if(newvmtype.toLowerCase() == "custom") {
                if(newvmcpumemsockets == "" || newvmcpumemcores == "" || newvmcpumemthreads == "" || newvmcpumemmemory == "") {
                    alert("For custom VM you need to set cpu and memory parameters!");
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                } else {
                    /* Custom VM */
                    this.myVmTemplateCustom.metadata.name = newvmname;
                    this.myVmTemplateCustom.metadata.namespace = newvmnamespace;
                    this.myVmTemplateCustom.metadata.labels = tmpLabels;
                    this.myVmTemplateCustom.spec.template.metadata.labels = tmpLabels;
                    this.myVmTemplateCustom.spec.template.spec.nodeSelector = {'kubernetes.io/hostname': newvmnode};
                    this.myVmTemplateCustom.spec.template.spec.priorityClassName = newvmpriorityclass;
                    this.myVmTemplateCustom.spec.template.spec.domain.cpu.cores = Number(newvmcpumemcores);
                    this.myVmTemplateCustom.spec.template.spec.domain.cpu.threads = Number(newvmcpumemthreads);
                    this.myVmTemplateCustom.spec.template.spec.domain.cpu.sockets = Number(newvmcpumemsockets);
                    this.myVmTemplateCustom.spec.template.spec.domain.resources.requests.memory = newvmcpumemmemory + "Gi";

                    /* Clean up devices */
                    while(this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.length > 0) {
                        this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.pop();
                    }
                    while(this.myVmTemplateCustom.spec.template.spec.volumes.length > 0){
                        this.myVmTemplateCustom.spec.template.spec.volumes.pop();
                    }
                
                    /* Clean up networks */
                    while(this.myVmTemplateCustom.spec.template.spec.networks.length > 0){
                        this.myVmTemplateCustom.spec.template.spec.networks.pop();
                    }
                    while(this.myVmTemplateCustom.spec.template.spec.domain.devices.interfaces.length > 0) {
                        this.myVmTemplateCustom.spec.template.spec.domain.devices.interfaces.pop();
                    }
                }
            } else {
                /* Clean up devices */
                while(this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.length > 0) {
                    this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.pop();
                }
                while(this.myVmTemplateTyped.spec.template.spec.volumes.length > 0){
                    this.myVmTemplateTyped.spec.template.spec.volumes.pop();
                }
            
                /* Clean up networks */
                while(this.myVmTemplateTyped.spec.template.spec.networks.length > 0){
                    this.myVmTemplateTyped.spec.template.spec.networks.pop();
                }
                while(this.myVmTemplateTyped.spec.template.spec.domain.devices.interfaces.length > 0) {
                    this.myVmTemplateTyped.spec.template.spec.domain.devices.interfaces.pop();
                }

                this.myVmTemplateTyped.metadata.name = newvmname;
                this.myVmTemplateTyped.metadata.namespace = newvmnamespace;
                this.myVmTemplateTyped.metadata.labels = tmpLabels;
                this.myVmTemplateTyped.spec.template.metadata.labels = tmpLabels;
                this.myVmTemplateTyped.spec.template.spec.nodeSelector = {'kubernetes.io/hostname': newvmnode};
                this.myVmTemplateTyped.spec.template.spec.priorityClassName = newvmpriorityclass;
                this.myVmTemplateTyped.spec.instancetype.name = newvmtype;
            }

            /* Placeholders */
            let data = "";
            let disk1 = {};
            let disk2 = {};
            let disk3 = {};
            let device1 = {};
            let device2 = {};
            let device3 = {};
            let net1 = {};
            let iface1 = {};

            let cloudconfig  = "#cloud-config\n";
                cloudconfig += "manage_etc_hosts: true\n";
                cloudconfig += "hostname: " + newvmname + "\n";
            let netconfig  ="version: 1\n";
                netconfig += "config:\n";
                netconfig += "    - type: physical\n";
                netconfig += "      name: enp1s0\n";
                netconfig += "      subnets:\n";

            /* Disk1 setup */
            if(newvmdiskonetype == "image") {
                /* Create Disk From Image */
                let disk1name = newvmnamespace + "-"+ newvmname + "-disk1";
                try {
                    let disk1data = await lastValueFrom(this.dataVolumesService.createURLDataVolume(newvmnamespace, disk1name, newvmdiskonesize, newvmdiskonesc, newvmdiskoneurl));
                    disk1 = { 'name': "disk1", 'disk': {}};
                    device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            } else if (newvmdiskonetype == "blank") {
                /* Create Blank Disk */
                let disk1name = newvmnamespace + "-"+ newvmname + "-disk1";
                try {
                    let disk1data = await lastValueFrom(this.dataVolumesService.createBlankDataVolume(newvmnamespace, disk1name, newvmdiskonesize, newvmdiskonesc));
                    disk1 = { 'name': "disk1", 'disk': {}};
                    device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            } else if (newvmdiskonetype == "pvc") {
                /* Copy Existing PVC */
                let disk1name = newvmnamespace + "-"+ newvmname + "-disk1";
                try {
                    let disk1data = await lastValueFrom(this.dataVolumesService.createPVCDataVolume(newvmnamespace, disk1name, newvmdiskonesize, newvmdiskonesc, newvmdiskonevalue));
                    disk1 = { 'name': "disk1", 'disk': {}};
                    device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            } else if (newvmdiskonetype == "dv") {
                /* Use Existing Disk */
                disk1 = { 'name': "disk1", 'disk': {}};
                device1 = { 'name': "disk1", 'dataVolume': { 'name': newvmdiskonevalue}}
            }

            /* Disk2 setup */
            if(newvmdisktwotype == "image") {
                /* Create Disk From Image */
                let disk2name = newvmnamespace + "-"+ newvmname + "-disk2";
                try {
                    let disk2data = await lastValueFrom(this.dataVolumesService.createURLDataVolume(newvmnamespace, disk2name, newvmdisktwosize, newvmdisktwosc, newvmdisktwourl));
                    disk2 = { 'name': "disk2", 'disk': {}};
                    device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            } else if (newvmdisktwotype == "blank") {
                /* Create Blank Disk */
                let disk2name = newvmnamespace + "-"+ newvmname + "-disk2";
                try {
                    let disk2data = await lastValueFrom(this.dataVolumesService.createBlankDataVolume(newvmnamespace, disk2name, newvmdisktwosize, newvmdisktwosc));
                    disk2 = { 'name': "disk2", 'disk': {}};
                    device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            } else if (newvmdisktwotype == "pvc") {
                /* Copy Existing PVC */
                try {
                let disk2name = newvmnamespace + "-"+ newvmname + "-disk2";
                    let disk2data = await lastValueFrom(this.dataVolumesService.createPVCDataVolume(newvmnamespace, disk2name, newvmdisktwosize, newvmdisktwosc, newvmdisktwovalue));
                    disk2 = { 'name': "disk2", 'disk': {}};
                    device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                } catch (e) {
                    alert(e);
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                }
            }else if (newvmdisktwotype == "dv") {
                /* Use Existing Disk */
                disk2 = { 'name': "disk2", 'disk': {}};
                device2 = { 'name': "disk2", 'dataVolume': { 'name': newvmdisktwovalue}}
            }

            /* UserData Setup */
            if(newvmcloudinitusername != "") {
                cloudconfig += "user: " + newvmcloudinitusername + "\n";
            }
            if (newvmcloudinitpassword != "") {
                cloudconfig += "password: " + newvmcloudinitpassword + "\n";
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
            disk3 = {'name': "disk3", 'disk': {'bus': "virtio"}};
            device3 = {'name': "disk3", 'cloudInitNoCloud': {'userData': cloudconfig, 'networkData': netconfig}};
        

            /* Networking Setup */
            if(newvmnetwork != "podNetwork") {
                net1 = {'name': "br0", 'multus': {'networkName': newvmnetwork}};
                iface1 = { 'name': "br0", 'bridge': {}};
            } else {
                net1 = {'name': "default", 'pod': {}};
                iface1 = {'name': "default",'masquerade': {}};
            }

            /* Create the VM */
            if(newvmtype.toLowerCase() == "custom") {
                /* Create a custom CPU/Mem VM */
                this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.push(disk1);
                this.myVmTemplateCustom.spec.template.spec.volumes.push(device1);
                if(newvmdisktwotype == "image" || newvmdisktwotype == "blank" || newvmdisktwotype == "disk") {
                    this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.push(disk2);
                    this.myVmTemplateCustom.spec.template.spec.volumes.push(device2);
                }
                this.myVmTemplateCustom.spec.template.spec.domain.devices.disks.push(disk3);
                this.myVmTemplateCustom.spec.template.spec.volumes.push(device3);
                this.myVmTemplateCustom.spec.template.spec.networks.push(net1);
                this.myVmTemplateCustom.spec.template.spec.domain.devices.interfaces.push(iface1);
                try {
                    data = await lastValueFrom(this.kubeVirtService.createVm(newvmnamespace,newvmname, this.myVmTemplateCustom));
                    this.hideNewVm();
                    this.reloadComponent();
                } catch (e) {
                    alert(e);
                    console.log(e);
                }
            } else {
                this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.push(disk1);
                this.myVmTemplateTyped.spec.template.spec.volumes.push(device1);
                if(newvmdisktwotype == "image" || newvmdisktwotype == "blank" || newvmdisktwotype == "disk") {
                    this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.push(disk2);
                    this.myVmTemplateTyped.spec.template.spec.volumes.push(device2);
                }
                this.myVmTemplateTyped.spec.template.spec.domain.devices.disks.push(disk3);
                this.myVmTemplateTyped.spec.template.spec.volumes.push(device3);
                this.myVmTemplateTyped.spec.template.spec.networks.push(net1);
                this.myVmTemplateTyped.spec.template.spec.domain.devices.interfaces.push(iface1);
                try {
                    data = await lastValueFrom(this.kubeVirtService.createVm(newvmnamespace,newvmname, this.myVmTemplateTyped));
                    this.hideNewVm();
                    this.reloadComponent();
                } catch (e) {
                    alert(e);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Resize Window
     */
    showResize(vmName: string, vmNamespace: string, vmSockets: number, vmCores: number, vmThreads: number, vmMemory: string): void {
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
     * Hide Resize Windows
     */
    hideResize(): void {
        let modalDiv = document.getElementById("modal-resize");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
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
                    this.hideResize();
                    this.reloadComponent();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Delete Window
     */
    showDelete(vmName: string, vmNamespace: string): void {
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete!");
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
   * Hide Delete Window
   */
    hideDelete(): void {
        let modalDiv = document.getElementById("modal-delete");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
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
                    this.hideDelete();
                    this.reloadComponent();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }


    /*
     * Show Type Window
     */
    async showType(vmName: string, vmNamespace: string): Promise<void> {
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
   * Hide Type Window
   */
    hideType(): void {
        let modalDiv = document.getElementById("modal-type");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
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
                    this.hideType();
                    this.reloadComponent();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    /*
     * VM Basic Operations (start, stop, etc...)
     */
    async vmOperations(vmOperation: string, vmNamespace: string, vmName: string): Promise<void> {
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
     * New VM: Control Disk1 Options
     */
    async onChangeDiskOne(diskType: string, diskNamespace: string) {
        let diskOneValueField = document.getElementById("newvm-diskonevalue");
        let diskOneSizeField = document.getElementById("newvm-diskonesize");
        let diskOneURLField = document.getElementById("import-disk1-url");
        if(diskType == "none") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
            }
            if(diskOneURLField != null) {
                diskOneURLField.setAttribute("class", "modal fade");
                diskOneURLField.setAttribute("aria-modal", "false");
                diskOneURLField.setAttribute("role", "");
                diskOneURLField.setAttribute("aria-hidden", "true");
                diskOneURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "blank") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.removeAttribute("disabled");
            }
            if(diskOneURLField != null) {
                diskOneURLField.setAttribute("class", "modal fade");
                diskOneURLField.setAttribute("aria-modal", "false");
                diskOneURLField.setAttribute("role", "");
                diskOneURLField.setAttribute("aria-hidden", "true");
                diskOneURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "image") {
            if(diskOneValueField != null && diskOneSizeField != null) {
                diskOneSizeField.removeAttribute("disabled");
                diskOneValueField.setAttribute("disabled", "disabled");
            }
            if(diskOneURLField != null) {
                diskOneURLField.setAttribute("class", "modal fade show");
                diskOneURLField.setAttribute("aria-modal", "true");
                diskOneURLField.setAttribute("role", "dialog");
                diskOneURLField.setAttribute("aria-hidden", "false");
                diskOneURLField.setAttribute("style","display: contents;");
            }
        } else if (diskType == "pvc") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.innerHTML = await this.loadPVCOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.removeAttribute("disabled");
            }
            if(diskOneURLField != null) {
                diskOneURLField.setAttribute("class", "modal fade");
                diskOneURLField.setAttribute("aria-modal", "false");
                diskOneURLField.setAttribute("role", "");
                diskOneURLField.setAttribute("aria-hidden", "true");
                diskOneURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "dv") {
            if (diskOneValueField != null && diskOneSizeField != null) {
                diskOneValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
            }
            if(diskOneURLField != null) {
                diskOneURLField.setAttribute("class", "modal fade");
                diskOneURLField.setAttribute("aria-modal", "false");
                diskOneURLField.setAttribute("role", "");
                diskOneURLField.setAttribute("aria-hidden", "true");
                diskOneURLField.setAttribute("style","display: none;");
            }
        }
  }

    /*
     * New VM: Control Disk2 Options
     */
    async onChangeDiskTwo(diskType: string, diskNamespace: string) {
        let diskTwoValueField = document.getElementById("newvm-disktwovalue");
        let diskTwoSizeField = document.getElementById("newvm-disktwosize");
        let diskTwoURLField = document.getElementById("import-disk2-url");
        if(diskType == "none") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
            }
            if(diskTwoURLField != null) {
                diskTwoURLField.setAttribute("class", "modal fade");
                diskTwoURLField.setAttribute("aria-modal", "false");
                diskTwoURLField.setAttribute("role", "");
                diskTwoURLField.setAttribute("aria-hidden", "true");
                diskTwoURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "blank") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
            if(diskTwoURLField != null) {
                diskTwoURLField.setAttribute("class", "modal fade");
                diskTwoURLField.setAttribute("aria-modal", "false");
                diskTwoURLField.setAttribute("role", "");
                diskTwoURLField.setAttribute("aria-hidden", "true");
                diskTwoURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "image") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
            if(diskTwoURLField != null) {
                diskTwoURLField.setAttribute("class", "modal fade show");
                diskTwoURLField.setAttribute("aria-modal", "true");
                diskTwoURLField.setAttribute("role", "dialog");
                diskTwoURLField.setAttribute("aria-hidden", "false");
                diskTwoURLField.setAttribute("style","display: contents;");
            }
        } else if (diskType == "pvc") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.innerHTML = await this.loadPVCOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
            if(diskTwoURLField != null) {
                diskTwoURLField.setAttribute("class", "modal fade");
                diskTwoURLField.setAttribute("aria-modal", "false");
                diskTwoURLField.setAttribute("role", "");
                diskTwoURLField.setAttribute("aria-hidden", "true");
                diskTwoURLField.setAttribute("style","display: none;");
            }
        } else if (diskType == "dv") {
            if (diskTwoValueField != null && diskTwoSizeField != null) {
                diskTwoValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
            }
            if(diskTwoURLField != null) {
                diskTwoURLField.setAttribute("class", "modal fade");
                diskTwoURLField.setAttribute("aria-modal", "false");
                diskTwoURLField.setAttribute("role", "");
                diskTwoURLField.setAttribute("aria-hidden", "true");
                diskTwoURLField.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * New VM: Load Image Options
     */
    async loadPVCOptions(dvNamespace: string){
        let data = await lastValueFrom(this.k8sService.getNamespacedPersistentVolumeClaims(dvNamespace));
        let pvcSelectorOptions = "";
        let pvcs = data.items;
        for (let i = 0; i < pvcs.length; i++) {
            pvcSelectorOptions += "<option value=" + pvcs[i].metadata["name"] +">" + pvcs[i].metadata["name"] + "</option>\n";
        }
        return pvcSelectorOptions;
    }

    /*
     * New VM: Load Disk Options
     */
    async loadDiskOptions(dvNamespace: string) {
        let diskSelectorOptions = "";
        let data = await lastValueFrom(await this.dataVolumesService.getNamespacedDataVolumes(dvNamespace));
        let disks = data.items;
        for (let i = 0; i < disks.length; i++) {

            diskSelectorOptions += "<option value=" + disks[i].metadata["name"] +">" + disks[i].metadata["name"] + "</option>\n";
        }
        return diskSelectorOptions;
    }

    /*
     * New VM: Load Network Options
     */
    async onChangeNamespace(namespace: string) {
        let selectorNetworkField = document.getElementById("newvm-network");
        if(this.networkCheck) {
            let data = await lastValueFrom(this.k8sApisService.getNetworkAttachs());
            let networkSelectorOptions = "<option value=podNetwork>podNetwork</option>\n";
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
            if (selectorNetworkField != null && networkSelectorOptions != "") {
                selectorNetworkField.innerHTML = networkSelectorOptions;
                selectorNetworkField.removeAttribute("disabled");
            }
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
        const data = await lastValueFrom(this.k8sApisService.getCrds());
        let crds = data.items;
        for (let i = 0; i < crds.length; i++) {
            if(crds[i].metadata["name"] == "network-attachment-definitions.k8s.cni.cncf.io") {
                this.networkCheck = true;
            }
        }
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmlist`]);
        })
    }
}
