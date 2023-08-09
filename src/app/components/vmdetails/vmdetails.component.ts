import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { KubeVirtVMI } from 'src/app/models/kube-virt-vmi.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vmdetails',
  templateUrl: './vmdetails.component.html',
  styleUrls: ['./vmdetails.component.css']
})
export class VmdetailsComponent implements OnInit {

    vmName: string = "";
    vmNamespace: string = "";
    activeVm: KubeVirtVM = new KubeVirtVM;
    customTemplate: boolean = false;
    urlSafe: SafeResourceUrl = "";

    /* 
     * Network Information 
     */
    hasNet1: boolean = false;
    hasNet2: boolean = false;
    vmNetwork1 = {
        name: "",
        type: "",
        network: "",
        ip: ""
    };

    vmNetwork2 = {
        name: "",
        type: "",
        network: "",
        ip: ""
    };

    /* 
     * Disk Information
     */
    hasDisk1: boolean = false;
    hasDisk2: boolean = false;
    disk1Info = {
        "name": "",
        "namespace": "",
        "type": "",
        "backend": "",
        "dataVolumeName": "",
        "dataVolumeNamespace": "",
        "dataVolumeSource": "",
        "dataVolumeSourceValue": "",
        "accessMode": "",
        "cacheMode": "",
        "capacity":  "",
        "storageClass": ""

    };

    disk2Info = {
        "name": "",
        "namespace": "",
        "type": "",
        "backend": "",
        "dataVolumeName": "",
        "dataVolumeNamespace": "",
        "dataVolumeSource": "",
        "dataVolumeSourceValue": "",
        "accessMode": "",
        "cacheMode": "",
        "capacity":  "",
        "storageClass": ""

    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private k8sApisService: K8sApisService,
        private dataVolumesService: DataVolumesService,
        private kubeVirtService: KubeVirtService
    ) { }

    async ngOnInit(): Promise<void> {
        this.vmName = this.route.snapshot.params['name'];
        this.vmNamespace = this.route.snapshot.params['namespace'];
        await this.loadVm();
        this.loadNoVNC(this.activeVm.namespace, this.activeVm.name);
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Details");
        }
    }

    /*
     * Load VM
     */
    async loadVm(): Promise<void> {
        const data = await lastValueFrom(this.kubeVirtService.getVM(this.vmNamespace, this.vmName));

        this.activeVm = new KubeVirtVM();
        this.activeVm.name = data.metadata["name"];
        this.activeVm.namespace = data.metadata["namespace"];
        if(data.metadata.labels != null) {
            this.activeVm.labels = data.metadata.labels;
        }
        this.activeVm.creationTimestamp = new Date(data.metadata["creationTimestamp"]);
        this.activeVm.running = data.spec["running"];
        if (data.status) {
            this.activeVm.printableStatus = data.status["printableStatus"];
            if (this.activeVm.printableStatus.toLowerCase() == "running") {
                this.activeVm.running = true;
            }
        }

        /* Getting VM Type */
        try {
            this.activeVm.instType = data.spec.instancetype.name;
            this.customTemplate = false;
        } catch(e: any) {
            this.activeVm.instType = "custom";
            this.customTemplate = true;
            console.log(e);
        }

        if(this.activeVm.instType == "custom") {
            /* Custom VM has cpu / mem parameters */
            this.activeVm.cores = data.spec.template.spec.domain.cpu["cores"];
            this.activeVm.sockets = data.spec.template.spec.domain.cpu["sockets"];
            this.activeVm.threads = data.spec.template.spec.domain.cpu["threads"];
            this.activeVm.memory = data.spec.template.spec.domain.resources.requests["memory"];
        } else {
            /* load vCPU / Mem from type */
            try {
                const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceType(this.activeVm.instType));
                this.activeVm.cores = data.spec.cpu["guest"];
                this.activeVm.memory = data.spec.memory["guest"];
                this.activeVm.sockets = 1;
                this.activeVm.threads = 1;
            } catch (e: any) {
                this.activeVm.sockets = 0;
                this.activeVm.threads = 0;
                this.activeVm.cores = 0;
                this.activeVm.memory = "";
                console.log(e);
            }
        }
        try {
            this.activeVm.priorityClass = data.spec.template.spec.priorityClassName;
        } catch (e: any) {
            this.activeVm.priorityClass = "";
            console.log(e);
        }

        /* Loading Network Info */
        await this.loadNetInfo(data.spec.template.spec.domain.devices.interfaces, data.spec.template.spec.networks);

        if(this.activeVm.running && data.status && data.status["printableStatus"].toLowerCase() == "running") {
            let currentVmi = new KubeVirtVMI;
            try {
                const datavmi = await lastValueFrom(this.kubeVirtService.getVMi(this.activeVm.namespace, this.activeVm.name));
                currentVmi = new KubeVirtVMI();
                currentVmi.name = datavmi.metadata["name"];
                currentVmi.namespace = datavmi.metadata["namespace"];
                currentVmi.running = true;
                currentVmi.creationTimestamp = new Date(datavmi.metadata["creationTimestamp"]);
                currentVmi.osId = datavmi.status.guestOSInfo["id"];
                currentVmi.osKernRel = datavmi.status.guestOSInfo["kernelRelease"];
                currentVmi.osKernVer = datavmi.status.guestOSInfo["kernelVersion"];
                currentVmi.osName = datavmi.status.guestOSInfo["name"];
                currentVmi.osPrettyName = datavmi.status.guestOSInfo["prettyName"];
                currentVmi.osVersion = datavmi.status.guestOSInfo["version"];

                /* Only works with guest-agent installed if not on podNetwork */
                try {
                    this.activeVm.nodeSel = datavmi.status["nodeName"];
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
                    console.log(e);
                }

                for(let k = 0; k < datavmi.status.interfaces.length; k++) {
                    if(datavmi.status.interfaces[k].name == this.vmNetwork1.name) {
                        this.vmNetwork1.ip = datavmi.status.interfaces[k]["ipAddress"];
                    } else if (datavmi.status.interfaces[k].name == this.vmNetwork2.name) {
                        this.vmNetwork2.ip = datavmi.status.interfaces[k]["ipAddress"];
                    }
                }

                currentVmi.nodeName = datavmi.status["nodeName"];
                this.activeVm.vmi = currentVmi;
            } catch (e: any) {
                console.log(e);
                console.log("ERROR Retrieving VMI: " + this.activeVm.name + "-" + this.activeVm.namespace + ":" + this.activeVm.status);
            }
        }

        /* Loading Disks */
        await this.loadDiskInfo(data.spec.template.spec.domain.devices.disks, data.spec.template.spec.volumes);
    }

    /*
     * Load Network Information
     */
    async loadNetInfo(interfaces: any, networks: any): Promise<void> {
        let actualNetwork = {
            name: "",
            type: "",
            network: "",
            ip: ""
        };

        if(interfaces != null && networks != null) {
            for(let i = 0; i < interfaces.length; i++) {
                actualNetwork.name = interfaces[i].name;
                try {
                    actualNetwork.network = networks[i].multus.networkName;
                } catch (e: any) {
                    actualNetwork.network = "podNetwork";
                    console.log(e);
                }

                try {
                    if(interfaces[i].masquerade != null) {
                        actualNetwork.type = "masquerade";
                    } else {
                        actualNetwork.type = "bridge";
                    }
                } catch (e: any) {
                    actualNetwork.type = "bridge";
                    console.log(e);
                }
                if(i == 0) {
                    try {
                        this.vmNetwork1.name = actualNetwork.name;
                        this.vmNetwork1.network = actualNetwork.network;
                        this.vmNetwork1.type = actualNetwork.type;
                        this.hasNet1 = true;
                    } catch (e: any) {
                        this.hasNet1 = false;
                        console.log(e);
                    }
                } else if (i == 1) {
                    try {
                        this.vmNetwork2.name = actualNetwork.name;
                        this.vmNetwork2.network = actualNetwork.network;
                        this.vmNetwork2.type = actualNetwork.type;
                        this.hasNet2 = true;
                    } catch (e: any) {
                        this.hasNet2 = false;
                        console.log(e);
                    }
                }
            }
        } else {
            this.hasNet1 = false;
            this.hasNet2 = false;
        }
    }

    /*
     * Load Disk Information
     */
    async loadDiskInfo(disks: any, volumes: any): Promise<void> {

        /* Find Disk */
        for (let i = 0; i < disks.length; i++) {
            let thisDiskInfo = {
                "name": "",
                "namespace": "",
                "type": "",
                "backend": "",
                "dataVolumeName": "",
                "dataVolumeNamespace": "",
                "dataVolumeSource": "",
                "dataVolumeSourceValue": "",
                "accessMode": "",
                "cacheMode": "",
                "capacity":  "",
                "storageClass": ""
        
            };
            thisDiskInfo.name = disks[i].name;
            thisDiskInfo.cacheMode = disks[i].cache;
            let keys = Object.keys(disks[i]);
            for (let j = 0; j < keys.length; j++) {
                if(keys[j].toLowerCase() != "name") {
                    thisDiskInfo.type = keys[j];
                }
            }
            /* Find Volume related to the Disk */
            for (let k = 0; k < volumes.length; k++) {
                if(volumes[k].name == thisDiskInfo.name) {
                    let volume_keys = Object.keys(volumes[k]);
                    for(let l = 0; l < volume_keys.length; l++) {
                        if(volume_keys[l].toLowerCase() != "name") {
                            if(volume_keys[l].toLowerCase() == "datavolume") {
                                thisDiskInfo.backend = volume_keys[l];
                                thisDiskInfo.dataVolumeName = volumes[k].dataVolume.name;
                                thisDiskInfo.dataVolumeNamespace = this.activeVm.namespace;
                            }
                        }
                    }
                }
            }

            try {
                /* Fetching Data Volume Template */
                if(thisDiskInfo.backend.toLowerCase() == "datavolume") {
                    let dvdata = await lastValueFrom(this.dataVolumesService.getDataVolumeInfo(thisDiskInfo.dataVolumeNamespace, thisDiskInfo.dataVolumeName));
                    thisDiskInfo.namespace = dvdata.metadata.namespace;
                    thisDiskInfo.dataVolumeNamespace = dvdata.metadata.namespace;
                    thisDiskInfo.accessMode = dvdata.spec.pvc.accessModes[0];
                    thisDiskInfo.capacity = dvdata.spec.pvc.resources.requests["storage"];
                    thisDiskInfo.storageClass = dvdata.spec.pvc["storageClassName"];
                    let this_source_keys = Object.keys(dvdata.spec.source);
                    for(let k = 0; k <  this_source_keys.length; k++) {
                        let this_key = this_source_keys[k];
                        switch (this_key) {
                            case "blank": 
                                thisDiskInfo.dataVolumeSource = "blank";
                                thisDiskInfo.dataVolumeSourceValue = "";
                                break;
                            case "s3":
                                thisDiskInfo.dataVolumeSource = "s3";
                                thisDiskInfo.dataVolumeSourceValue = dvdata.spec.source.s3.url;
                                break;
                            case "gcs":
                                thisDiskInfo.dataVolumeSource = "gcs";
                                thisDiskInfo.dataVolumeSourceValue = dvdata.spec.source.gcs.url;
                                break;
                            case "http":
                                thisDiskInfo.dataVolumeSource = "http";
                                thisDiskInfo.dataVolumeSourceValue = dvdata.spec.source.http.url;
                                break;
                            case "registry":
                                thisDiskInfo.dataVolumeSource = "registry";
                                thisDiskInfo.dataVolumeSourceValue = dvdata.spec.source.registry.url;
                                break;
                            case "pvc":
                                thisDiskInfo.dataVolumeSource = "pvc";
                                thisDiskInfo.dataVolumeSourceValue = dvdata.spec.source.pvc.namespace + " - " + dvdata.spec.source.pvc.name;
                                break;
                        }
                    }
                }
                /* Set the flag, and load disk info */
                if(thisDiskInfo.name == "disk1") {
                    this.hasDisk1 = true;
                    this.disk1Info = thisDiskInfo;
                } else if (thisDiskInfo.name == "disk2") {
                    this.hasDisk2 = true;
                    this.disk2Info = thisDiskInfo;
                }
            } catch (e: any) {
                this.hasDisk1 = false;
                this.hasDisk2 = false;
                console.log(e);
            }
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
    }

    /*
     * Show VM Type Window
     */
    async showType(): Promise<void> {
        let modalDiv = document.getElementById("modal-type");
        let selectorTypeFiled = document.getElementById("changevm-type");
        let typeSelectorOptions = "";
        let data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        for (let i = 0; i < data.items.length; i++) {
            typeSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorTypeFiled != null) {
            selectorTypeFiled.innerHTML = typeSelectorOptions;
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
    async applyType(namespace: string, name: string, type: string): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubeVirtService.changeVmType(namespace, name, type));
            this.hideComponent("modal-type");
            this.reloadComponent();
        } catch (e: any) {
            alert(e.message.error);
            console.log(e);
        }
    }

    /*
     * Show Resize VM Window
     */
    showResize(sockets: number, cores: number, threads: number, memory: string): void {
        let modalDiv = document.getElementById("modal-resize");
        let resizeSocketsField = document.getElementById("resize-sockets");
        let resizeCoresField = document.getElementById("resize-cores");
        let resizeThreadsField = document.getElementById("resize-threads");
        let resizeMemoryField = document.getElementById("resize-memory");
        if(resizeSocketsField != null && resizeCoresField != null && resizeThreadsField != null && resizeMemoryField != null) {
            resizeSocketsField.setAttribute("placeholder", sockets.toString());
            resizeCoresField.setAttribute("placeholder", cores.toString());
            resizeThreadsField.setAttribute("placeholder", threads.toString());
            resizeMemoryField.setAttribute("placeholder", memory.toString());
            resizeSocketsField.setAttribute("value", sockets.toString());
            resizeCoresField.setAttribute("value", cores.toString());
            resizeThreadsField.setAttribute("value", threads.toString());
            resizeMemoryField.setAttribute("value", memory.replace("Gi", "").toString());
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
    async applyResize(resizeNamespace: string, resizeName: string, sockets: string, cores: string, threads: string, memory: string): Promise<void> {
        if(sockets != "" && cores != "" && threads != "" && memory != "") {
            try {
                const data = await lastValueFrom(this.kubeVirtService.scaleVm(resizeNamespace, resizeName, cores, threads, sockets, memory));
                this.hideComponent("modal-resize");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        }
    }

    /*
     * Show Priority Class Window
     */
    async showPc(): Promise<void> {
        let modalDiv = document.getElementById("modal-pc");
        let selectorPcFiled = document.getElementById("changevm-pc");
        let pcSelectorOptions = "";
        let data = await lastValueFrom(this.k8sApisService.getPriorityClasses());
        for (let i = 0; i < data.items.length; i++) {
            pcSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorPcFiled != null) {
            selectorPcFiled.innerHTML = pcSelectorOptions;
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
     * Change VM Priority Class
     */
    async applyPc(namespace: string, name: string, pc: string): Promise<void> {
        try {
            const data = await lastValueFrom(this.kubeVirtService.changeVmPc(namespace, name, pc));
            this.hideComponent("modal-pc");
            this.reloadComponent();
        } catch (e: any) {
            alert(e.message.error);
            console.log(e);
        }
    }

    /*
     * Open NoVNC
     */
    openNoVNC(namespace: string, name: string): void {
        let url = "/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=";
        let path = "/k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
        let fullpath = url + path;
        let newwindow = window.open(fullpath, "kubevirt-manager.io: CONSOLE", "width=800,height=600,location=no,toolbar=no,menubar=no,resizable=yes");
    }

    /*
     * Load NoVNC
     */
    loadNoVNC(namespace: string, name: string): void {
        let url = "/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=";
        let path = "/k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
        let fullpath = url + path;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(fullpath);
    }
    
    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmdetail/${this.vmNamespace}/${this.vmName}`]);
        })
    }

}

