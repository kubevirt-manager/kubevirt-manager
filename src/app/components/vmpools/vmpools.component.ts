import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { KubeVirtVMI } from 'src/app/models/kube-virt-vmi.model';
import { KubeVirtVMPool } from 'src/app/models/kube-virt-vmpool.model';
import { NetworkAttach } from 'src/app/models/network-attach.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { K8sService } from 'src/app/services/k8s.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { DataVolume } from 'src/app/templates/data-volume.apitemplate';
import { Probe } from 'src/app/templates/probe.apitemplate';
import { VMPool } from 'src/app/templates/vmpool.apitemplate';

@Component({
  selector: 'app-vmpools',
  templateUrl: './vmpools.component.html',
  styleUrls: ['./vmpools.component.css']
})
export class VMPoolsComponent implements OnInit {

    poolList: KubeVirtVMPool[] = [];
    vmList: KubeVirtVM[] = [];
    namespaceList: string[] = [];
    networkList: NetworkAttach[] = [];
    netAttachList: NetworkAttach[] = []
    networkCheck: boolean = false;

    myVmPoolCustom = new VMPool().myVmPoolCustom;
    myVmPoolTyped = new VMPool().myVmPoolType;
    myVmPoolReadinessProbe = new Probe().readinessProbe;
    myVmPoolLivenessProbe = new Probe().livenessProbe;
    blankDiskTemplate = new DataVolume().blankDisk;
    httpDiskTemplate = new DataVolume().httpDisk;
    s3DiskTemplate = new DataVolume().s3Disk;
    gcsDiskTemplate = new DataVolume().gcsDisk;
    registryDiskTemplate = new DataVolume().registryDisk;
    pvcDiskTemplate = new DataVolume().pvcDisk;

    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private router: Router,
        private k8sService: K8sService,
        private k8sApisService: K8sApisService,
        private dataVolumesService: DataVolumesService,
        private kubeVirtService: KubeVirtService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getPools();
        await this.checkNetwork();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Pools");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Load Pool List
     */
    async getPools(): Promise<void> {
        let currentPool = new KubeVirtVMPool;
        const data = await lastValueFrom(this.kubeVirtService.getVMPools());
        let pools = data.items;
        for(let i = 0; i < pools.length; i++) {
            currentPool = new KubeVirtVMPool();
            currentPool.name = pools[i].metadata["name"];
            currentPool.namespace = pools[i].metadata["namespace"];
            currentPool.creationTimestamp = new Date(pools[i].metadata["creationTimestamp"]);
            currentPool.replicas = pools[i].spec["replicas"];
            currentPool.running = pools[i].spec.virtualMachineTemplate.spec["running"];
            /* Getting VM Type */
            try {
                currentPool.instType = pools[i].spec.virtualMachineTemplate.spec.instancetype.name;
            } catch(e: any) {
                currentPool.instType = "custom";
                console.log(e);
            }

            /* Getting Ready Replicas */
            if(currentPool.readyReplicas != null) {
                try {
                    currentPool.readyReplicas = Number(pools[i].status["readyReplicas"]);
                } catch (e: any) {
                    currentPool.readyReplicas = 0;
                    console.log(e);
                }
            }

            if(currentPool.instType == "custom") {
                /* Custom VM has cpu / mem parameters */
                currentPool.cores = pools[i].spec.virtualMachineTemplate.spec.template.spec.domain.cpu["cores"];
                currentPool.sockets = pools[i].spec.virtualMachineTemplate.spec.template.spec.domain.cpu["sockets"];
                currentPool.threads = pools[i].spec.virtualMachineTemplate.spec.template.spec.domain.cpu["threads"];
                currentPool.memory = pools[i].spec.virtualMachineTemplate.spec.template.spec.domain.resources.requests["memory"];
            } else {
                /* load vCPU / Mem from type */
                try {
                    const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(currentPool.instType));
                    currentPool.cores = data.spec.cpu["guest"];
                    currentPool.memory = data.spec.memory["guest"];
                    currentPool.sockets = 1;
                    currentPool.threads = 1;
                } catch (e: any) {
                    currentPool.sockets = 0;
                    currentPool.threads = 0;
                    currentPool.cores = 0;
                    currentPool.memory = "";
                    console.log(e);
                }
            }
            await this.getPoolVM(currentPool.namespace, currentPool.name);
            currentPool.vmlist = this.vmList;
            this.poolList.push(currentPool);
        }
    }

    /*
     * Load VM List
     */
    async getPoolVM(namespace: string, poolName: string): Promise<void> {
        this.vmList = [];
        let currentVm = new KubeVirtVM;
        const data = await lastValueFrom(this.kubeVirtService.getPooledVM(namespace, poolName));
        let vms = data.items;
        for (let i = 0; i < vms.length; i++) {
            currentVm = new KubeVirtVM();
            currentVm.name = vms[i].metadata["name"];
            currentVm.namespace = vms[i].metadata["namespace"];
            currentVm.creationTimestamp = new Date(vms[i].metadata["creationTimestamp"]);
            currentVm.running = vms[i].spec["running"];
            try {
                currentVm.status = vms[i].status["printableStatus"];
                if (currentVm.status.toLowerCase() == "running") {
                    currentVm.running = true;
                }
            } catch (e: any) {
                currentVm.status = "";
                console.log(e);
            }
            try {
                currentVm.nodeSel = vms[i].spec.template.spec.nodeSelector["kubernetes.io/hostname"];
            } catch (e:any) {
                currentVm.nodeSel = "auto-select";
                console.log(e);
            }

            /* Getting VM Type */
            try {
                currentVm.instType = vms[i].spec.instancetype.name;
            } catch(e: any) {
                currentVm.instType = "custom";
                console.log(e);
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
                } catch (e: any) {
                    currentVm.sockets = 0;
                    currentVm.threads = 0;
                    currentVm.cores = 0;
                    currentVm.memory = "";
                    console.log(e);
                }
            }

            try {
                if(vms[i].status["ready"] != null) {
                    currentVm.ready = vms[i].status["ready"];
                }
            } catch (e: any) {
                currentVm.ready = false;
                console.log(e);
            }

            if(currentVm.running && currentVm.status && vms[i].status["printableStatus"].toLowerCase() == "running") {
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

                    /* Only works with guest-agent installed */
                    try {
                        currentVm.nodeSel = datavmi.status["nodeName"];
                        currentVmi.ifAddr = datavmi.status.interfaces[0]["ipAddress"];
                        currentVmi.ifName = datavmi.status.interfaces[0]["name"];
                    } catch(e: any) {
                        currentVmi.ifAddr = "";
                        currentVmi.ifName = "";
                        console.log(e);
                    }

                    currentVmi.nodeName = datavmi.status["nodeName"];
                    currentVm.vmi = currentVmi;
                } catch (e: any) {
                    console.log(e);
                    console.log("ERROR Retrieving VMI: " + currentVm.name + "-" + currentVm.namespace + ":" + currentVm.status);
                }
            }
            this.vmList.push(currentVm);
        }
    }

    /*
     * Show New Pool Window
     */
    async showNewPool(): Promise<void> {
        clearInterval(this.myInterval);
        let i = 0;
        let modalDiv = document.getElementById("modal-newpool");
        let modalTitle = document.getElementById("newpool-title");
        let modalBody = document.getElementById("newpool-value");

        let selectorNamespacesField = document.getElementById("newpool-namespace");
        let selectorTypeField = document.getElementById("newpool-type");
        let selectorPCField = document.getElementById("newpool-pc");
        let selectorSCOneField = document.getElementById("newpool-diskonesc");
        let selectorSCTwoField = document.getElementById("newpool-disktwosc");

        let data: any;

        /* Load Namespace List and Set Selector */
        let nsSelectorOptions = "";
        try {
            data = await lastValueFrom(this.k8sService.getNamespaces());
            for (i = 0; i < data.items.length; i++) {
                this.namespaceList.push(data.items[i].metadata["name"]);
                nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e);
        }

        /* Show new window
         * to avoid delays
         */
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Virtual Machine Pool");
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
            console.log(e);
        }

        /* Load Storage Class List and Set Selector */
        let storageSelectorOptions = "";
        try {
            data = await lastValueFrom(this.k8sApisService.getStorageClasses());
            for (i = 0; i < data.items.length; i++) {
                storageSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e);
        }

        /* Load Priority Class List and Set Selector */
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
            console.log(e);
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

        /* Clean up devices */
        while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
            this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
        }
        while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
            this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
        }
        while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
            this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
        }
        while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
            this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
        }

        /* Clean up networks */
        while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
            this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
        }
        while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
            this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
        }
        while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
            this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
        }
        while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
            this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
        }

    }

    /*
     * New VM: Create the New VM
     */
    async applyNewPool(
        newpoolname: string,
        newpoolnamespace: string,
        newpoolreplicas: string,
        newpoollabelkeyone: string,
        newpoollabelvalueone: string,
        newpoollabelkeytwo: string,
        newpoollabelvaluetwo: string,
        newpoollabelkeythree: string,
        newpoollabelvaluethree: string,
        newpoollabelkeyfour: string,
        newpoollabelvaluefour: string,
        newpoollabelkeyfive: string,
        newpoollabelvaluefive: string,
        newpooltype: string,
        newpoolcpumemsockets: string,
        newpoolcpumemcores: string,
        newpoolcpumemthreads: string,
        newpoolcpumemmemory: string,
        newpoolpriorityclass: string,
        newpooldiskonetype: string,
        newpooldiskonevalue: string,
        newpooldiskonesize: string,
        newpooldiskonesc: string,
        newpooldiskoneam: string,
        newpooldiskoneurl: string,
        newpooldiskonecm: string,
        newpooldisktwotype: string,
        newpooldisktwovalue: string,
        newpooldisktwosize: string,
        newpooldisktwosc: string,
        newpooldisktwoam: string,
        newpooldisktwourl: string,
        newpooldisktwocm: string,
        newpoolnetwork: string,
        newpoolnetworktype: string,
        newpoollivenessenable: string,
        newpoollivenesstype: string,
        newpoollivenesspath: string,
        newpoollivenessport: string,
        newpoollivenessinitialdelay: string,
        newpoollivenessinterval: string,
        newpoollivenesstimeout: string,
        newpoollivenessfailure: string,
        newpoollivenesssuccess: string,
        newpoolreadinessenable: string,
        newpoolreadinesstype: string,
        newpoolreadinesspath: string,
        newpoolreadinessport: string,
        newpoolreadinessinitialdelay: string,
        newpoolreadinessinterval: string,
        newpoolreadinesstimeout: string,
        newpoolreadinessfailure: string,
        newpoolreadinesssuccess: string,
        newpooluserdatausername: string,
        newpooluserdataauth: string,
        newpooluserdatapassword: string,
        newpooluserdatassh: string,
        newpoolinitscript: string
    ) {
        /* Basic Form Fields Check/Validation */
        if(newpoolname == "" || newpoolnamespace == "") {
            alert("You need to fill in the name and namespace fields!");
        } else if (newpooldiskonetype == "none") {
            alert("Your virtual machine needs at least the first disk!");
        } else if ((newpooldiskonetype == "blank" || newpooldiskonetype == "http" || newpooldiskonetype == "s3" || newpooldiskonetype == "gcs" || newpooldiskonetype == "registry") && newpooldiskonesize == "") {
            alert("You need to set a size for your disk!");
        } else if ((newpooldiskonetype == "http" || newpooldiskonetype == "s3" || newpooldiskonetype == "gcs" || newpooldiskonetype == "registry") && ((newpooldiskoneurl == "") || (!newpooldiskoneurl.startsWith("http") && !newpooldiskoneurl.startsWith("s3://") && !newpooldiskoneurl.startsWith("gcs://") && !newpooldiskoneurl.startsWith("docker://")))) {
            alert("You need to enter import URL your Disk 1!\nUse protocol://");
        } else if (newpooldiskonetype == "disk" && newpooldiskonevalue == "") {
            alert("You need to select the disk!");
        } else if ((newpooldisktwotype == "blank" || newpooldisktwotype == "http" || newpooldisktwotype == "s3" || newpooldisktwotype == "gcs" || newpooldisktwotype == "registry") && newpooldisktwosize == "") {
            alert("You need to set a size for your disk!");
        } else if ((newpooldisktwotype == "http" || newpooldisktwotype == "s3" || newpooldisktwotype == "gcs" || newpooldisktwotype == "registry") && ((newpooldisktwourl == "") || (!newpooldisktwourl.startsWith("http") && !newpooldisktwourl.startsWith("s3://") && !newpooldisktwourl.startsWith("gcs://") && !newpooldisktwourl.startsWith("docker://")))) {
            alert("You need to enter import URL your Disk 2!\nUse protocol://");
        } else if (newpooldisktwotype == "disk" && newpooldisktwovalue == "") {
            alert("You need to select the disk!");
        } else if(this.checkPoolExists(newpoolname, newpoolnamespace)) {
            alert("Pool with name/namespace combination already exists!");
        } else if(newpooltype.toLowerCase() == "none" || newpooltype.toLowerCase() == "") {
            alert("Please select a valid VM type!");
        } else if(newpoollivenessenable == "true" && (newpoollivenessport == "" || newpoollivenessinitialdelay == "" ||  newpoollivenessinterval == "" || newpoollivenesstimeout == "" || newpoollivenessfailure == "" || newpoollivenesssuccess == "")) {
            alert("You need to enter all the Liveness Probe details!");
        } else if (newpoollivenessenable == "true" && newpoollivenesstype == "http" && newpoollivenesspath == "") {
            alert("You need to enter HTTP Path details on the Liveness Probe tab!");
        } else if(newpoolreadinessenable == "true" && (newpoolreadinessport == "" || newpoolreadinessinitialdelay == "" ||  newpoolreadinessinterval == "" || newpoolreadinesstimeout == "" || newpoolreadinessfailure == "" || newpoolreadinesssuccess == "")) {
            alert("You need to enter all the Readiness Probe details!");
        } else if (newpoolreadinessenable == "true" && newpoolreadinesstype == "http" && newpoolreadinesspath == "") {
            alert("You need to enter HTTP Path details on the Readiness Probe tab!");
        } else {

            /* Load Custom Labels */
            let tmpLabels = {};
            if(newpoollabelkeyone != "") {
                let thisLabel = {
                    [newpoollabelkeyone]: newpoollabelvalueone
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newpoollabelkeytwo != "") {
                let thisLabel = {
                    [newpoollabelkeytwo]: newpoollabelvaluetwo
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newpoollabelkeythree != "") {
                let thisLabel = {
                    [newpoollabelkeythree]: newpoollabelvaluethree
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newpoollabelkeyfour != "") {
                let thisLabel = {
                    [newpoollabelkeyfour]: newpoollabelvaluefour
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newpoollabelkeyfive != "") {
                let thisLabel = {
                    [newpoollabelkeyfive]: newpoollabelvaluefive
                };
                Object.assign(tmpLabels, thisLabel);
            }

            /* Load other labels */
            let thisLabel = {'kubevirt.io/vmpool': newpoolname};
            Object.assign(tmpLabels, thisLabel);

            let kubevirtManagerLabel = {'kubevirt-manager.io/managed': "true"};
            Object.assign(tmpLabels, kubevirtManagerLabel);

            /* Check VM Type */
            if(newpooltype.toLowerCase() == "custom") {
                if(newpoolcpumemsockets == "" || newpoolcpumemcores == "" || newpoolcpumemthreads == "" || newpoolcpumemmemory == "") {
                    alert("For custom VM you need to set cpu and memory parameters!");
                    throw new Error("For custom VM you need to set cpu and memory parameters!");
                } else {
                    /* Custom VM */
                    this.myVmPoolCustom.metadata.name = newpoolname;
                    this.myVmPoolCustom.metadata.namespace = newpoolnamespace;
                    this.myVmPoolCustom.metadata.labels =  tmpLabels;
                    this.myVmPoolCustom.spec.selector.matchLabels = tmpLabels;
                    this.myVmPoolCustom.spec.virtualMachineTemplate.metadata.labels = tmpLabels;
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.metadata.labels = tmpLabels;
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = newpoolpriorityclass;

                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.cores = Number(newpoolcpumemcores);
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.threads = Number(newpoolcpumemthreads);
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.cpu.sockets = Number(newpoolcpumemsockets);
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.resources.requests.memory = newpoolcpumemmemory + "Gi";

                    /* Clean up datavolume */
                    while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.dataVolumeTemplates.length > 0) {
                        this.myVmPoolCustom.spec.virtualMachineTemplate.spec.dataVolumeTemplates.pop();
                    }

                    /* Clean up devices */
                    while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                        this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
                    }
                    while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                        this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
                    }
                    
                    /* Clean up networks */
                    while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                        this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
                    }
                    while(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                        this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
                    }
                }
            } else {
                /* Clean up datavolume */
                while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.dataVolumeTemplates.length > 0) {
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.dataVolumeTemplates.pop();
                }

                /* Clean up devices */
                while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.length > 0) {
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.pop();
                }
                while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.length > 0){
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.pop();
                }
                
                /* Clean up networks */
                while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.networks.length > 0){
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.networks.pop();
                }
                while(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.length > 0) {
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.pop();
                }

                this.myVmPoolTyped.metadata.name = newpoolname;
                this.myVmPoolTyped.metadata.namespace = newpoolnamespace;
                this.myVmPoolTyped.metadata.labels =  tmpLabels;
                this.myVmPoolTyped.spec.selector.matchLabels = tmpLabels;
                this.myVmPoolTyped.spec.virtualMachineTemplate.metadata.labels = tmpLabels;
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.metadata.labels = tmpLabels;
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.priorityClassName = newpoolpriorityclass;
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.instancetype.name = newpooltype;
            }

            /* Placeholders */
            let data = "";
            let disk1dv = {};
            let disk2dv = {};
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
                // Removed so machines can have pool generated hostnames
                // cloudconfig += "hostname: " + newpoolname + "\n";

            let netconfig  ="version: 1\n";
                netconfig += "config:\n";
                netconfig += "    - type: physical\n";
                netconfig += "      name: enp1s0\n";
                netconfig += "      subnets:\n";
                netconfig += "      - type: dhcp\n";

            /* Disk1 setup */
            if(newpooldiskonetype == "http") {
                /* Create Disk From Image */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.httpDiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                tmpdv.spec.source.http.url = newpooldiskoneurl;
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            } else if(newpooldiskonetype == "s3") {
                /* Create Disk From Image */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.s3DiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                tmpdv.spec.source.s3.url = newpooldiskoneurl;
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            } else if(newpooldiskonetype == "gcs") {
                /* Create Disk From Image */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.gcsDiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                tmpdv.spec.source.gcs.url = newpooldiskoneurl;
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            } else if(newpooldiskonetype == "registry") {
                /* Create Disk From Image */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.registryDiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                tmpdv.spec.source.registry.url = newpooldiskoneurl;
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            } else if (newpooldiskonetype == "blank") {
                /* Create Blank Disk */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.blankDiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            } else if (newpooldiskonetype == "pvc") {
                /* Copy Existing PVC */
                let disk1name = newpoolnamespace + "-"+ newpoolname + "-disk1";
                let tmpdv = this.pvcDiskTemplate;
                tmpdv.metadata.name = disk1name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldiskonesc;
                tmpdv.spec.pvc.accessModes[0] = newpooldiskoneam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldiskonesize + "Gi";
                tmpdv.spec.source.pvc.name = newpooldiskonevalue;
                tmpdv.spec.source.pvc.namespace = newpoolnamespace;
                if(newpooldiskonecm != "") {
                    disk1 = { 'name': "disk1", 'cache': newpooldiskonecm, 'disk': {}};
                } else {
                    disk1 = { 'name': "disk1", 'disk': {}};
                }
                device1 = { 'name': "disk1", 'dataVolume': { 'name': disk1name}}
                disk1dv = tmpdv;
            }

            /* Disk2 setup */
            if(newpooldisktwotype == "http") {
                /* Create Disk From Image */
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.httpDiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                tmpdv.spec.source.http.url = newpooldisktwourl;
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            } else if(newpooldisktwotype == "s3") {
                /* Create Disk From Image */
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.s3DiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                tmpdv.spec.source.s3.url = newpooldisktwourl;
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            } else if(newpooldisktwotype == "gcs") {
                /* Create Disk From Image */
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.gcsDiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                tmpdv.spec.source.gcs.url = newpooldisktwourl;
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            } else if(newpooldisktwotype == "registry") {
                /* Create Disk From Image */
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.registryDiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                tmpdv.spec.source.registry.url = newpooldisktwourl;
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            } else if (newpooldisktwotype == "blank") {
                /* Create Blank Disk */
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.blankDiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            } else if (newpooldisktwotype == "pvc") {
                let disk2name = newpoolnamespace + "-"+ newpoolname + "-disk2";
                let tmpdv = this.pvcDiskTemplate;
                tmpdv.metadata.name = disk2name;
                tmpdv.metadata.namespace = newpoolnamespace;
                tmpdv.spec.pvc.storageClassName = newpooldisktwosc;
                tmpdv.spec.pvc.accessModes[0] = newpooldisktwoam;
                tmpdv.spec.pvc.resources.requests.storage = newpooldisktwosize + "Gi";
                tmpdv.spec.source.pvc.name = newpooldisktwovalue;
                tmpdv.spec.source.pvc.namespace = newpoolnamespace;
                if(newpooldisktwocm != "") {
                    disk2 = { 'name': "disk2", 'cache': newpooldisktwocm, 'disk': {}};
                } else {
                    disk2 = { 'name': "disk2", 'disk': {}};
                }
                device2 = { 'name': "disk2", 'dataVolume': { 'name': disk2name}}
                disk2dv = tmpdv;
            }

            /* UserData Setup */
            if(newpooluserdatausername != "") {
                cloudconfig += "user: " + newpooluserdatausername + "\n";
            }
            if(newpooluserdataauth.toLowerCase() == "ssh") {
                if (newpooluserdatassh != "") {
                    cloudconfig += "ssh_authorized_keys:\n";
                    cloudconfig += "  - " + newpooluserdatassh + "\n";
                }
            } else {
                if (newpooluserdatapassword != "") {
                    cloudconfig += "password: " + newpooluserdatapassword + "\n";
                }
            }

            /* Init Script Setup */
            if(newpoolinitscript != "") {
                cloudconfig += "runcmd: \n";
                for (const line of newpoolinitscript.split(/[\r\n]+/)){
                    cloudconfig += "  - " + line + "\n";
                }
            }


            /* Adding UserData/NetworkData device */
            disk3 = {'name': "disk3", 'disk': {'bus': "virtio"}};
            device3 = {'name': "disk3", 'cloudInitNoCloud': {'userData': cloudconfig, 'networkData': netconfig}};
        

            /* Networking Setup */
            if(newpoolnetwork != "podNetwork") {
                net1 = {'name': "net1", 'multus': {'networkName': newpoolnetwork}};
            } else {
                net1 = {'name': "net1", 'pod': {}};
            }
            if(newpoolnetworktype == "bridge") {
                iface1 = {'name': "net1", 'bridge': {}};
            } else {
                iface1 = {'name': "net1", 'masquerade': {}};
            }

            /* Liveness Probe Setup */
            if(newpoollivenessenable == "enabled") {
                /* Adjusting our Probe */
                if(newpoollivenesstype.toLowerCase() == "http") {
                    let myHttpProbe = new Probe().httpProbe;
                    myHttpProbe.initialDelaySeconds = Number(newpoollivenessinitialdelay);
                    myHttpProbe.periodSeconds  = Number(newpoollivenessinterval);
                    myHttpProbe.timeoutSeconds = Number(newpoollivenesstimeout);
                    myHttpProbe.failureThreshold = Number(newpoollivenessfailure);
                    myHttpProbe.successThreshold = Number(newpoollivenesssuccess);
                    myHttpProbe.httpGet.path = newpoollivenesspath;
                    myHttpProbe.httpGet.port = Number(newpoollivenessport);
                    this.myVmPoolLivenessProbe = myHttpProbe;
                } else {
                    let myTcpProbe = new Probe().tcpProbe;
                    myTcpProbe.initialDelaySeconds = Number(newpoollivenessinitialdelay);
                    myTcpProbe.periodSeconds  = Number(newpoollivenessinterval);
                    myTcpProbe.timeoutSeconds = Number(newpoollivenesstimeout);
                    myTcpProbe.failureThreshold = Number(newpoollivenessfailure);
                    myTcpProbe.successThreshold = Number(newpoollivenesssuccess);
                    myTcpProbe.tcpSocket.port = Number(newpoollivenessport);
                    this.myVmPoolLivenessProbe= myTcpProbe;
                }

                /* Assigning to our object */
                let liveness = { 'livenessProbe': this.myVmPoolLivenessProbe };
                if(newpooltype.toLowerCase() == "custom") {
                    Object.assign(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec, liveness);
                } else {
                    Object.assign(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec, liveness);
                }
            }

            /* Readiness Probe Setup */
            if(newpoolreadinessenable == "enabled") {
                /* Adjusting our Probe */
                if(newpoolreadinesstype.toLowerCase() == "http") {
                    let myHttpProbe = new Probe().httpProbe;
                    myHttpProbe.initialDelaySeconds = Number(newpoolreadinessinitialdelay);
                    myHttpProbe.periodSeconds  = Number(newpoolreadinessinterval);
                    myHttpProbe.timeoutSeconds = Number(newpoolreadinesstimeout);
                    myHttpProbe.failureThreshold = Number(newpoolreadinessfailure);
                    myHttpProbe.successThreshold = Number(newpoolreadinesssuccess);
                    myHttpProbe.httpGet.path = newpoolreadinesspath;
                    myHttpProbe.httpGet.port = Number(newpoolreadinessport);
                    this.myVmPoolReadinessProbe = myHttpProbe;
                } else {
                    let myTcpProbe = new Probe().tcpProbe;
                    myTcpProbe.initialDelaySeconds = Number(newpoolreadinessinitialdelay);
                    myTcpProbe.periodSeconds  = Number(newpoolreadinessinterval);
                    myTcpProbe.timeoutSeconds = Number(newpoolreadinesstimeout);
                    myTcpProbe.failureThreshold = Number(newpoolreadinessfailure);
                    myTcpProbe.successThreshold = Number(newpoolreadinesssuccess);
                    myTcpProbe.tcpSocket.port = Number(newpoolreadinessport);
                    this.myVmPoolReadinessProbe= myTcpProbe;
                }

                /* Assigning to our object */
                let readiness = { 'readinessProbe': this.myVmPoolReadinessProbe };
                if(newpooltype.toLowerCase() == "custom") {
                    Object.assign(this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec, readiness);
                } else {
                    Object.assign(this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec, readiness);
                }
            }

            /* Create the VM */
            if(newpooltype.toLowerCase() == "custom") {
                /* Create a custom CPU/Mem VM */
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.dataVolumeTemplates.push(disk1dv);
                if(newpooldisktwotype == "image" || newpooldisktwotype == "blank" || newpooldisktwotype == "disk") {
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk2);
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device2);
                    this.myVmPoolCustom.spec.virtualMachineTemplate.spec.dataVolumeTemplates.push(disk2dv);
                }
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk3);
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device3);
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);
                this.myVmPoolCustom.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
                try {
                    this.myVmPoolCustom.spec.replicas = Number(newpoolreplicas);
                    data = await lastValueFrom(this.kubeVirtService.createPool(newpoolnamespace, newpoolname, this.myVmPoolCustom));
                    this.hideComponent("modal-newpool");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            } else {
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk1);
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device1);
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.dataVolumeTemplates.push(disk1dv);
                if(newpooldisktwotype == "image" || newpooldisktwotype == "blank" || newpooldisktwotype == "disk") {
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk2);
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device2);
                    this.myVmPoolTyped.spec.virtualMachineTemplate.spec.dataVolumeTemplates.push(disk2dv);
                }
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.disks.push(disk3);
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.volumes.push(device3);
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.networks.push(net1);
                this.myVmPoolTyped.spec.virtualMachineTemplate.spec.template.spec.domain.devices.interfaces.push(iface1);
                try {
                    this.myVmPoolTyped.spec.replicas = Number(newpoolreplicas);
                    data = await lastValueFrom(this.kubeVirtService.createPool(newpoolnamespace, newpoolname, this.myVmPoolTyped));
                    this.hideComponent("modal-newpool");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
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
        } else if (vmOperation == "delete") {
            const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
            this.reloadComponent();
        }
    }

    /*
     * Remove VM From Pool
     */
    async removeVmFromPool(vmNamespace: string, vmName: string, vmNode: string) {
        try {
            const data = await lastValueFrom(this.kubeVirtService.removeVmFromPool(vmNamespace, vmName, vmNode));
            this.reloadComponent();
        } catch (e: any) {
            alert(e.error.message);
            console.log(e);
        }
    }

    /*
     * Pool Basic Operations (start, stop, etc...)
     */
    async poolOperations(poolOperation: string, poolNamespace: string, poolName: string): Promise<void> {
        clearInterval(this.myInterval);
        if(poolOperation == "start"){
            var data = await lastValueFrom(this.kubeVirtService.startPool(poolNamespace, poolName));
            this.reloadComponent();
        } else if (poolOperation == "stop") {
            var data = await lastValueFrom(this.kubeVirtService.stopPool(poolNamespace, poolName));
            this.reloadComponent();
        } else if (poolOperation == "delete") {
            const data = await lastValueFrom(this.kubeVirtService.deletePool(poolNamespace, poolName));
            this.reloadComponent();
        }
    }

    /*
     * Show Replicas Window
     */
    showReplicas(poolNamespace: string, poolName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-replicas");
        let modalTitle = document.getElementById("replicas-title");
        let modalBody = document.getElementById("replicas-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Scale: "+ poolNamespace + " - " + poolName);
        }
        if(modalBody != null) {
            let replicasNamespace = document.getElementById("replicas-namespace");
            let replicasName = document.getElementById("replicas-pool");
            if(replicasName != null && replicasNamespace != null) {
                replicasName.setAttribute("value", poolName);
                replicasNamespace.setAttribute("value", poolNamespace);
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
     * Perform Resize of VM Pool
     */
    async applyReplicas(replicasSize: string): Promise<void> {
        let nameField = document.getElementById("replicas-pool");
        let namespaceField = document.getElementById("replicas-namespace");
        if(replicasSize != null && nameField != null && namespaceField != null) {
            let poolNamespace = namespaceField.getAttribute("value");
            let poolName = nameField.getAttribute("value");
            if(replicasSize != null && poolName != null && poolNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.scalePoolReplicas(poolNamespace, poolName, replicasSize));
                    this.hideComponent("modal-resize");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Delete Window
     */
    showDelete(poolNamespace: string, poolName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let poolNameInput = document.getElementById("delete-name");
            let poolNamespaceInput = document.getElementById("delete-namespace");
            if(poolNameInput != null && poolNamespaceInput != null) {
                poolNameInput.setAttribute("value", poolName);
                poolNamespaceInput.setAttribute("value", poolNamespace);
                modalBody.replaceChildren("Are you sure you want to delete " + poolName + " on namespace: " + poolNamespace + "?");
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
     * Delete Virtual Machine Pool
     */
    async applyDelete(): Promise<void> {
        let poolNameInput = document.getElementById("delete-name");
        let poolNamespaceInput = document.getElementById("delete-namespace");
        if(poolNameInput != null && poolNamespaceInput != null) {
            let poolName = poolNameInput.getAttribute("value");
            let poolNamespace = poolNamespaceInput.getAttribute("value");
            if(poolName != null && poolNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.deletePool(poolNamespace, poolName));
                    this.hideComponent("modal-delete");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Delete VM Window
     */
    showDeleteVM(vmName: string, vmNamespace: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-deletevm");
        let modalTitle = document.getElementById("deletevm-title");
        let modalBody = document.getElementById("deletevm-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let vmNameInput = document.getElementById("deletevm-name");
            let vmNamespaceInput = document.getElementById("deletevm-namespace");
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
    async applyDeleteVM(): Promise<void> {
        let vmNameInput = document.getElementById("deletevm-name");
        let vmNamespaceInput = document.getElementById("deletevm-namespace");
        if(vmNameInput != null && vmNamespaceInput != null) {
            let vmName = vmNameInput.getAttribute("value");
            let vmNamespace = vmNamespaceInput.getAttribute("value");
            if(vmName != null && vmNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
                    this.hideComponent("modal-deletevm");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Resize Pool Window
     */
    showResize(poolName: string, poolNamespace: string, poolSockets: number, poolCores: number, poolThreads: number, poolMemory: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-resize");
        let modalTitle = document.getElementById("resize-title");
        let modalBody = document.getElementById("resize-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Resize: " + poolName);
        }
        if(modalBody != null) {
            let resizeNameField = document.getElementById("resize-name");
            let resizeNamespaceField = document.getElementById("resize-namespace");
            let resizeSocketsField = document.getElementById("resize-sockets");
            let resizeCoresField = document.getElementById("resize-cores");
            let resizeThreadsField = document.getElementById("resize-threads");
            let resizeMemoryField = document.getElementById("resize-memory");
            if(resizeNameField != null && resizeNamespaceField != null && resizeSocketsField != null && resizeCoresField != null && resizeThreadsField != null && resizeMemoryField != null) {
                resizeNameField.setAttribute("value", poolName);
                resizeNamespaceField.setAttribute("value", poolNamespace);
                resizeSocketsField.setAttribute("placeholder", poolSockets.toString());
                resizeCoresField.setAttribute("placeholder", poolCores.toString());
                resizeThreadsField.setAttribute("placeholder", poolThreads.toString());
                resizeMemoryField.setAttribute("placeholder", poolMemory.toString());
                resizeSocketsField.setAttribute("value", poolSockets.toString());
                resizeCoresField.setAttribute("value", poolCores.toString());
                resizeThreadsField.setAttribute("value", poolThreads.toString());
                resizeMemoryField.setAttribute("value", poolMemory.replace("Gi", "").toString());
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
     * Resize Virtual Machine Pool
     */
    async applyResize(sockets: string, cores: string, threads: string, memory: string): Promise<void> {
        let resizeNameField = document.getElementById("resize-name");
        let resizeNamespaceField = document.getElementById("resize-namespace");
        if(sockets != "" && cores != "" && threads != "" && memory != "" && resizeNameField != null && resizeNamespaceField != null) {
            let resizeName = resizeNameField.getAttribute("value");
            let resizeNamespace = resizeNamespaceField.getAttribute("value");
            if(resizeName != null && resizeNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.scalePool(resizeNamespace, resizeName, cores, threads, sockets, memory));
                    this.hideComponent("modal-resize");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Pool Type Window
     */
    async showType(poolName: string, poolNamespace: string): Promise<void> {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-type");
        let modalTitle = document.getElementById("type-title");
        let modalBody = document.getElementById("type-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Change Pool Type");
        }
        if(modalBody != null) {
            let poolNameInput = document.getElementById("type-pool");
            let poolNamespaceInput = document.getElementById("type-namespace");
            let selectorTypeFiled = document.getElementById("changepool-type");
            if(poolNameInput != null && poolNamespaceInput != null) {
                poolNameInput.setAttribute("value", poolName);
                poolNamespaceInput.setAttribute("value", poolNamespace);
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
     * Change Pool Type
     */
    async applyType(poolType: string): Promise<void> {
        let poolNameInput = document.getElementById("type-pool");
        let poolNamespaceInput = document.getElementById("type-namespace");
        if(poolNameInput != null && poolNamespaceInput != null) {
            let poolName = poolNameInput.getAttribute("value");
            let poolNamespace = poolNamespaceInput.getAttribute("value");
            if(poolName != null && poolNamespace != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.changePoolType(poolNamespace, poolName, poolType));
                    this.hideComponent("modal-type");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * New Pool: Control Disk1 Options
     */
    async onChangeDiskOne(diskType: string, diskNamespace: string) {
        let diskOneValueField = document.getElementById("newpool-diskonevalue");
        let diskOneSizeField = document.getElementById("newpool-diskonesize");
        let diskOneURLField = document.getElementById("newpool-disk1-url");
        if(diskType == "none") {
            if (diskOneValueField != null && diskOneSizeField != null && diskOneURLField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
                diskOneURLField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "blank") {
            if (diskOneValueField != null && diskOneSizeField != null && diskOneURLField != null) {
                diskOneValueField.setAttribute("disabled", "disabled");
                diskOneSizeField.removeAttribute("disabled");
                diskOneURLField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "http" || diskType == "s3" || diskType == "registry") {
            if(diskOneValueField != null && diskOneSizeField != null && diskOneURLField != null) {
                diskOneSizeField.removeAttribute("disabled");
                diskOneURLField.removeAttribute("disabled");
                diskOneValueField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "pvc") {
            if (diskOneValueField != null && diskOneSizeField != null && diskOneURLField != null) {
                diskOneValueField.innerHTML = await this.loadPVCOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.removeAttribute("disabled");
                diskOneURLField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "dv") {
            if (diskOneValueField != null && diskOneSizeField != null && diskOneURLField != null) {
                diskOneValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskOneValueField.removeAttribute("disabled");
                diskOneSizeField.setAttribute("disabled", "disabled");
                diskOneURLField.setAttribute("disabled", "disabled");                
            }
        }
    }

    /*
     * New Pool: Control Disk2 Options
     */
    async onChangeDiskTwo(diskType: string, diskNamespace: string) {
        let diskTwoValueField = document.getElementById("newpool-disktwovalue");
        let diskTwoSizeField = document.getElementById("newpool-disktwosize");
        let diskTwoURLField = document.getElementById("newpool-disk2-url");
        if(diskType == "none") {
            if (diskTwoValueField != null && diskTwoSizeField != null && diskTwoURLField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
                diskTwoURLField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "blank") {
            if (diskTwoValueField != null && diskTwoSizeField != null && diskTwoURLField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoURLField.setAttribute("disabled", "disabled");
                diskTwoSizeField.removeAttribute("disabled");
            }
        } else if (diskType == "http" || diskType == "s3" || diskType == "registry") {
            if (diskTwoValueField != null && diskTwoSizeField != null && diskTwoURLField != null) {
                diskTwoValueField.setAttribute("disabled", "disabled");
                diskTwoSizeField.removeAttribute("disabled");
                diskTwoURLField.removeAttribute("disabled");
            }
        } else if (diskType == "pvc") {
            if (diskTwoValueField != null && diskTwoSizeField != null && diskTwoURLField != null) {
                diskTwoValueField.innerHTML = await this.loadPVCOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.removeAttribute("disabled");
                diskTwoURLField.setAttribute("disabled", "disabled");
            }
        } else if (diskType == "dv") {
            if (diskTwoValueField != null && diskTwoSizeField != null && diskTwoURLField != null) {
                diskTwoValueField.innerHTML = await this.loadDiskOptions(diskNamespace);
                diskTwoValueField.removeAttribute("disabled");
                diskTwoSizeField.setAttribute("disabled", "disabled");
                diskTwoURLField.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New Pool: Load Image Options
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
            console.log(e);
        }
        return pvcSelectorOptions;
    }

    /*
     * New Pool: Load Disk Options
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
            console.log(e);
        }
        return diskSelectorOptions;
    }

    /*
     * New Pool: Load Network Options
     */
    async onChangeNamespace(namespace: string) {
        let selectorNetworkField = document.getElementById("newpool-network");
        let networkSelectorOptions = "<option value=podNetwork>podNetwork</option>\n";
        if(this.networkCheck) {
            try {
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
            } catch (e: any) {
                console.log(e);
            }
        }
        if (selectorNetworkField != null && networkSelectorOptions != "") {
            selectorNetworkField.innerHTML = networkSelectorOptions;
        }
    }

    /*
     * New Pool: Display Custom CPU/MEM
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
     * New POOL: Change between pass/ssh auth
     */
    async onChangeAuthType(authType: string) {
        let modalSSHDiv = document.getElementById("newpool-userdata-ssh-panel");
        let modelPWDDiv = document.getElementById("newpool-userdata-password-panel");
        if(authType.toLowerCase() == "ssh") {
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
     * New POOL: Enable bridge/masquerade selector
     */
    async onChangeNetwork(thisNetwork: string) {
        let selectorNetworkTypeField = document.getElementById("newpool-networktype");
        let networkTypeSelectorOptions = "<option value=bridge>bridge</option>\n";
        if(thisNetwork.toLowerCase() == "podnetwork") {
            networkTypeSelectorOptions += "<option value=masquerade>masquerade</option>\n";
        } 
        if(selectorNetworkTypeField != null) {
            selectorNetworkTypeField.innerHTML = networkTypeSelectorOptions;
        }
    }

    /*
     * Check Pool Exists
     */
    checkPoolExists(poolName: string, poolNamespace:string): boolean {
        for (let i = 0; i < this.poolList.length; i++) {
            if(this.poolList[i].name == poolName && this.poolList[i].namespace == poolNamespace) {
                return true;
            }
        }
        return false;
    }

    /*
     * New POOL: Enable/Disable Liveness Probe
     */
    async onChangeLiveness(status: string) {
        let hcType = document.getElementById("newpool-liveness-type");
        let hcPort = document.getElementById("newpool-liveness-port");
        let hcDelay = document.getElementById("newpool-liveness-initialdelay");
        let hcInterval = document.getElementById("newpool-liveness-interval");
        let hcTimeout = document.getElementById("newpool-liveness-timeout");
        let hcFailure = document.getElementById("newpool-liveness-failure");
        let hcSuccess = document.getElementById("newpool-liveness-success");
        
        if ( hcType != null && hcPort != null && hcDelay != null && hcInterval != null && 
             hcTimeout != null && hcFailure != null && hcSuccess != null ) {
            if(status.toLowerCase() == "enabled") {
                hcType.removeAttribute("disabled");
                hcPort.removeAttribute("disabled");
                hcDelay.removeAttribute("disabled");
                hcInterval.removeAttribute("disabled");
                hcTimeout.removeAttribute("disabled");
                hcFailure.removeAttribute("disabled");
                hcSuccess.removeAttribute("disabled");
            } else {
                hcType.setAttribute("disabled", "disabled");
                hcPort.setAttribute("disabled", "disabled");
                hcDelay.setAttribute("disabled", "disabled");
                hcInterval.setAttribute("disabled", "disabled");
                hcTimeout.setAttribute("disabled", "disabled");
                hcFailure.setAttribute("disabled", "disabled");
                hcSuccess.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New POOL: Change Liveness Type
     */
    async onChangeLivenessType(hcType: string) {
        let modalPath = document.getElementById("newpool-liveness-path-panel");
        if (modalPath != null) {
            if (hcType.toLowerCase() == "http") {
                modalPath.setAttribute("class", "modal fade show");
                modalPath.setAttribute("aria-modal", "true");
                modalPath.setAttribute("role", "dialog");
                modalPath.setAttribute("aria-hidden", "false");
                modalPath.setAttribute("style","display: contents;");
            } else {
                modalPath.setAttribute("class", "modal fade");
                modalPath.setAttribute("aria-modal", "false");
                modalPath.setAttribute("role", "");
                modalPath.setAttribute("aria-hidden", "true");
                modalPath.setAttribute("style","display: none;");
            }
        }
    }

    /*
     * New POOL: Enable/Disable Readiness Probe
     */
    async onChangeReadiness(status: string) {
        let hcType = document.getElementById("newpool-readiness-type");
        let hcPort = document.getElementById("newpool-readiness-port");
        let hcDelay = document.getElementById("newpool-readiness-initialdelay");
        let hcInterval = document.getElementById("newpool-readiness-interval");
        let hcTimeout = document.getElementById("newpool-readiness-timeout");
        let hcFailure = document.getElementById("newpool-readiness-failure");
        let hcSuccess = document.getElementById("newpool-readiness-success");
        
        if ( hcType != null && hcPort != null && hcDelay != null && hcInterval != null && 
             hcTimeout != null && hcFailure != null && hcSuccess != null ) {
            if(status.toLowerCase() == "enabled") {
                hcType.removeAttribute("disabled");
                hcPort.removeAttribute("disabled");
                hcDelay.removeAttribute("disabled");
                hcInterval.removeAttribute("disabled");
                hcTimeout.removeAttribute("disabled");
                hcFailure.removeAttribute("disabled");
                hcSuccess.removeAttribute("disabled");
            } else {
                hcType.setAttribute("disabled", "disabled");
                hcPort.setAttribute("disabled", "disabled");
                hcDelay.setAttribute("disabled", "disabled");
                hcInterval.setAttribute("disabled", "disabled");
                hcTimeout.setAttribute("disabled", "disabled");
                hcFailure.setAttribute("disabled", "disabled");
                hcSuccess.setAttribute("disabled", "disabled");
            }
        }
    }

    /*
     * New POOL: Change Readiness Probe Type
     */
    async onChangeReadinessType(hcType: string) {
        let modalPath = document.getElementById("newpool-readiness-path-panel");
        if (modalPath != null) {
            if (hcType.toLowerCase() == "http") {
                modalPath.setAttribute("class", "modal fade show");
                modalPath.setAttribute("aria-modal", "true");
                modalPath.setAttribute("role", "dialog");
                modalPath.setAttribute("aria-hidden", "false");
                modalPath.setAttribute("style","display: contents;");
            } else {
                modalPath.setAttribute("class", "modal fade");
                modalPath.setAttribute("aria-modal", "false");
                modalPath.setAttribute("role", "");
                modalPath.setAttribute("aria-hidden", "true");
                modalPath.setAttribute("style","display: none;");
            }
        }
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
            console.log(e);
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
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmpools`]);
        })
    }

}
