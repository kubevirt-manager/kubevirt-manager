import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { PrometheusService } from 'src/app/services/prometheus.service';
import { Chart } from 'chart.js/auto'
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
    promCheck: boolean = false;

    myInterval = setInterval(() =>{ this.reloadCharts(); }, 30000);

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

    /* Prometheus query data */
    promStartTime = 0;
    promEndTime = 0;
    promInterval = 3600; // Prometheus Window 30 minutes
    promStep = 30;       // Prometheus Step 20 seconds

    /* Chart.JS placeholder */
    cpuChart: any;
    memChart: any;
    netChart: any;
    stgChart: any;

    /* Console Reader */
    consoleMessages: Array<string> = new Array();
    newConsoleMessages: { text: string, style: string }[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private k8sApisService: K8sApisService,
        private dataVolumesService: DataVolumesService,
        private prometheusService: PrometheusService,
        private kubeVirtService: KubeVirtService,
        private cdRef: ChangeDetectorRef
    ) { }

    async ngOnInit(): Promise<void> {
        this.vmName = this.route.snapshot.params['name'];
        this.vmNamespace = this.route.snapshot.params['namespace'];
        await this.loadVm();
        await this.loadPrometheus();
        await this.loadSerialLog();
        this.loadNoVNC(this.activeVm.namespace, this.activeVm.name);
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Details");
        }
    }

    /*
     * Serial Log
     */
    async loadSerialLog(): Promise<void> {
        let podName = "";
        try {
            let data = await lastValueFrom(this.kubeVirtService.findVMPod(this.vmNamespace, this.activeVm.vmi.uid));
            podName = data.items[0].metadata["name"];
            data = await lastValueFrom(this.kubeVirtService.getVMSerialLog(this.vmNamespace, podName));
            data = data.replace(/\n/g, '<br />\n');
            for (const line of data.split(/[\r\n]+/)){
                this.parseAnsiLog(line);
            }
            
        } catch (e: any) {
            console.log(e);
        }
    }

    private parseAnsiLog(log: string) {
        const ansiRegex = /\x1b\[((?:\d|;)*)([a-zA-Z])/g;
        let lastIndex = 0;
        let currentStyle = 'color:#dadada;';
        
        log.replace(ansiRegex, (match, codes, letter, offset) => {
            // Push the text before the ANSI code
            this.newConsoleMessages.push({
                text: log.substring(lastIndex, offset),
                style: currentStyle
            });
            
            lastIndex = offset + match.length;
            
            // Process ANSI codes
            const codeList = codes.split(';').map(Number);
            for (const code of codeList) {
                currentStyle = this.applyAnsiCode(code, currentStyle);
            }
            return ''; // This is just to satisfy the replace function
        });
        
        // Push the remaining text after the last ANSI code
        this.newConsoleMessages.push({
            text: log.substring(lastIndex),
            style: currentStyle
        });
    }
    
    private applyAnsiCode(code: number, currentStyle: string): string {
        switch (code) {
            case 0: return 'color:#dadada;'; // Reset
            case 1: return currentStyle + 'font-weight:bold;'; // Bold
            case 3: return currentStyle + 'font-style:italic;'; // Italic
            case 4: return currentStyle + 'text-decoration:underline;'; // Underline
            case 30: return 'color:black;';
            case 31: return 'color:red;';
            case 32: return 'color:green;';
            case 33: return 'color:yellow;';
            case 34: return 'color:blue;';
            case 35: return 'color:magenta;';
            case 36: return 'color:cyan;';
            case 37: return 'color:white;';
            // Add more codes as needed
            default: return currentStyle;
        }
    }

    /*
     * Load Prometheus Metrics
     */
    async loadPrometheus(): Promise<void>  {
        try {
            const data = await lastValueFrom(this.prometheusService.checkPrometheus());
            if(data["status"].toLowerCase() == "success") {
                this.promCheck = true;
                await this.getTimestamps();
                this.cpuGraph();
                this.memGraph();
                this.netGraph();
                this.stgGraph();
            } else {
                this.promCheck = false;
            }
        } catch (e: any) {
            this.promCheck = false;
            console.log("No prometheus...");
        }
    }

    /*
     * Reload Prometheus Metrics
     */
    async reloadPrometheus(): Promise<void>  {
        try {
            const data = await lastValueFrom(this.prometheusService.checkPrometheus());
            if(data["status"].toLowerCase() == "success") {
                this.promCheck = true;
                await this.getTimestamps();
                this.cpuGraphReload();
                this.memGraphReload();
                this.netGraphReload();
                this.stgGraphReload();
            } else {
                this.promCheck = false;
            }
        } catch (e: any) {
            this.promCheck = false;
            console.log("No prometheus...");
        }
    }

    /*
     * Generate timestamps for Prometheus Query
     */
    async getTimestamps(): Promise<void>  {
        this.promEndTime = Math.floor(Date.now() / 1000)
        this.promStartTime = this.promEndTime - this.promInterval;
    }

    /*
     * Reload cpu data
     */
    async cpuGraphReload(): Promise<void> {
        /* get CPU data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMCpuSummary(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Data for Graph */
        let cpuData = data.map(function(value: any[],index: any) { return value[1]; });
        let labelData = Array(cpuData.length).fill("");

        this.cpuChart.data.labels = labelData;
        this.cpuChart.data.datasets[0].data = cpuData;

        this.cpuChart.update();
    }

    /*
     * Generate CPU Graph
     */
    async cpuGraph(): Promise<void> {
        let maxCpu = this.activeVm.cores * this.activeVm.sockets * this.activeVm.threads;

        /* get CPU data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMCpuSummary(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Data for Graph */
        let cpuData = data.map(function(value: any[],index: any) { return value[1]; });
        let labelData = Array(cpuData.length).fill("");

        this.cpuChart = new Chart("CpuChart", {
            type: 'line',
            data: {
              labels: labelData, 
                 datasets: [
                {
                  label: "CPU Usage",
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  data: cpuData,
                  backgroundColor: 'blue',
                  borderColor: 'blue',
                  fill: true
                }  
              ]
            },
            options: {
              aspectRatio:5,
              animations: {
                tension: {
                  duration: 1000,
                  easing: 'linear',
                  from: 1,
                  to: 0,
                  loop: false
                }
              },
              scales: {
                x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    min: 0,
                    max: maxCpu,
                    grid: {
                      display: true
                    }
                  }
              }
            }
            
        });
    }

     /*
     * Reload Memory Data
     */
     async memGraphReload(): Promise<void> {
        /* get Memory data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMMemSummary(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Data for Graph */
        let memData = data.map(function(value: any[],index: any) { return value[1]; });
        let labelData = Array(memData.length).fill("");

        this.memChart.data.labels = labelData;
        this.memChart.data.datasets[0].data = memData;

        this.memChart.update();

    }

    /*
     * Generate Memory Graph
     */
    async memGraph(): Promise<void> {
        /* get Memory data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMMemSummary(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Data for Graph */
        let memData = data.map(function(value: any[],index: any) { return value[1]; });
        let labelData = Array(memData.length).fill("");

        this.memChart = new Chart("MemChart", {
            type: 'line',
            data: {
              labels: labelData, 
                 datasets: [
                {
                  label: "Mem Usage",
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  data: memData,
                  backgroundColor: 'green',
                  borderColor: 'green',
                  fill: true
                }  
              ]
            },
            options: {
              aspectRatio:5,
              animations: {
                tension: {
                  duration: 1000,
                  easing: 'linear',
                  from: 1,
                  to: 0,
                  loop: false
                }
              },
              scales: {
                x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    min: 0,
                    max: Number.parseInt(this.activeVm.memory.split("Gi")[0]) * 1024,
                    grid: {
                      display: true
                    }
                  }
              }
            }
            
        });

    }

    /*
     * Reload Network Data
     */
    async netGraphReload(): Promise<void> {
        /* get Network Sent data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMNetSent(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Sent Data for Graph */
        let sentData = data.map(function(value: any[],index: any) { return value[1]; });

        let i = 0;

        /* Convert sent data to kbytes */
        for(i = 0; i < sentData.length; i++) {
            sentData[i] = (sentData[i]/1024)/1024;
        }

        /* get Network Received data from Prometheus */
        response = await lastValueFrom(this.prometheusService.getVMNetRecv(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        data = response.data.result[0].values;

        /* prepare Received Data for Graph */
        let recvData = data.map(function(value: any[],index: any) { return value[1]; });

        /* Convert received data to kbytes */
        for(i = 0; i < recvData.length; i++) {
            recvData[i] = (recvData[i]/1024)/1024;
        }

        let labelData = Array(sentData.length).fill("");

        this.netChart.data.labels = labelData;
        this.netChart.data.datasets[0].data = sentData;
        this.netChart.data.datasets[1].data = recvData;

        this.netChart.update();
    }

    /*
     * Generate Network Graph (bytes)
     */
    async netGraph(): Promise<void> {
        /* get Network Sent data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMNetSent(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Sent Data for Graph */
        let sentData = data.map(function(value: any[],index: any) { return value[1]; });

        let i = 0;

        /* Convert sent data to kbytes */
        for(i = 0; i < sentData.length; i++) {
            sentData[i] = (sentData[i]/1024)/1024;
        }

        /* get Network Received data from Prometheus */
        response = await lastValueFrom(this.prometheusService.getVMNetRecv(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        data = response.data.result[0].values;

        /* prepare Received Data for Graph */
        let recvData = data.map(function(value: any[],index: any) { return value[1]; });

        /* Convert received data to kbytes */
        for(i = 0; i < recvData.length; i++) {
            recvData[i] = (recvData[i]/1024)/1024;
        }

        let labelData = Array(sentData.length).fill("");

        this.netChart = new Chart("NetChart", {
            type: 'line',
            data: {
              labels: labelData, 
                 datasets: [
                {
                  label: "Sent",
                  data: sentData,
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  borderColor: 'green',
                  backgroundColor: 'green'
                },
                {
                  label: "Recv",
                  data: recvData,
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  borderColor: 'blue',
                  backgroundColor: 'blue'
                }
              ]
            },
            options: {
                aspectRatio:5,
                animations: {
                  tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: false
                  }
                },
                scales: {
                  x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      min: 0,
                      grid: {
                        display: true
                      }
                    }
                }
              }
            
        });

    }

    /*
     * Reload Storage Data
     */
    async stgGraphReload(): Promise<void> {
        /* get Storage Read data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMStorageRead(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Read Data for Graph */
        let readData = data.map(function(value: any[],index: any) { return value[1]; });

        let i = 0;

        /* Convert read data to mbytes */
        for(i = 0; i < readData.length; i++) {
            readData[i] = (readData[i]/1024)/1024;
        }

        /* get Storage Write data from Prometheus */
        response = await lastValueFrom(this.prometheusService.getVMStorageWrite(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        data = response.data.result[0].values;

        /* prepare Write Data for Graph */
        let writeData = data.map(function(value: any[],index: any) { return value[1]; });

        /* Convert write data to mbytes */
        for(i = 0; i < writeData.length; i++) {
            writeData[i] = (writeData[i]/1024)/1024;
        }

        let labelData = Array(readData.length).fill("");

        this.stgChart.data.labels = labelData;
        this.stgChart.data.datasets[0].data = readData;
        this.stgChart.data.datasets[1].data = writeData;

        this.stgChart.update();
    }

    /*
     * Generate Storage Graph (bytes)
     */
    async stgGraph(): Promise<void> {
        /* get Storage Read data from Prometheus */
        let response = await lastValueFrom(this.prometheusService.getVMStorageRead(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        let data = response.data.result[0].values;

        /* prepare Read Data for Graph */
        let readData = data.map(function(value: any[],index: any) { return value[1]; });

        let i = 0;

        /* Convert read data to mbytes */
        for(i = 0; i < readData.length; i++) {
            readData[i] = (readData[i]/1024)/1024;
        }

        /* get Storage Write data from Prometheus */
        response = await lastValueFrom(this.prometheusService.getVMStorageWrite(this.vmName, this.vmNamespace, this.promStartTime, this.promEndTime, this.promStep));
        data = response.data.result[0].values;

        /* prepare Write Data for Graph */
        let writeData = data.map(function(value: any[],index: any) { return value[1]; });

        /* Convert write data to mbytes */
        for(i = 0; i < writeData.length; i++) {
            writeData[i] = (writeData[i]/1024)/1024;
        }

        let labelData = Array(readData.length).fill("");

        this.stgChart = new Chart("StgChart", {
            type: 'line',
            data: {
              labels: labelData, 
                 datasets: [
                {
                  label: "Read",
                  data: readData,
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  borderColor: 'green',
                  backgroundColor: 'green'
                },
                {
                  label: "Write",
                  data: writeData,
                  pointRadius: 1,
                  pointBorderWidth: 0,
                  tension: 1,
                  borderWidth: 3,
                  borderColor: 'blue',
                  backgroundColor: 'blue'
                  }
              ]
            },
            options: {
                aspectRatio:5,
                animations: {
                  tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: false
                  }
                },
                scales: {
                  x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      min: 0,
                      grid: {
                        display: true
                      }
                    }
                }
              }
            
        });

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
            this.activeVm.printableStatus = data.status["printableStatus"].toLowerCase();
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
                currentVmi.uid = datavmi.metadata["uid"];
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
                }

                try {
                    if(interfaces[i].masquerade != null) {
                        actualNetwork.type = "masquerade";
                    } else {
                        actualNetwork.type = "bridge";
                    }
                } catch (e: any) {
                    actualNetwork.type = "bridge";
                }
                if(i == 0) {
                    try {
                        this.vmNetwork1.name = actualNetwork.name;
                        this.vmNetwork1.network = actualNetwork.network;
                        this.vmNetwork1.type = actualNetwork.type;
                        this.hasNet1 = true;
                    } catch (e: any) {
                        this.hasNet1 = false;
                    }
                } else if (i == 1) {
                    try {
                        this.vmNetwork2.name = actualNetwork.name;
                        this.vmNetwork2.network = actualNetwork.network;
                        this.vmNetwork2.type = actualNetwork.type;
                        this.hasNet2 = true;
                    } catch (e: any) {
                        this.hasNet2 = false;
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
                    try {
                        thisDiskInfo.accessMode = dvdata.spec.pvc.accessModes[0];
                        thisDiskInfo.capacity = dvdata.spec.pvc.resources.requests["storage"];
                        thisDiskInfo.storageClass = dvdata.spec.pvc["storageClassName"];
                    } catch (e: any) {
                        thisDiskInfo.accessMode = dvdata.spec.storage.accessModes[0];
                        thisDiskInfo.capacity = dvdata.spec.storage.resources.requests["storage"];
                        thisDiskInfo.storageClass = dvdata.spec.storage["storageClassName"];
                    }
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
        let path = "k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
        let fullpath = url + path;
        let newwindow = window.open(fullpath, "kubevirt-manager.io: CONSOLE", "width=800,height=600,location=no,toolbar=no,menubar=no,resizable=yes");
    }

    /*
     * Load NoVNC
     */
    loadNoVNC(namespace: string, name: string): void {
        let url = "/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=";
        let path = "k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + namespace + "/virtualmachineinstances/" + name + "/vnc";
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

    /*
     * Reload Charts
     */
    async reloadCharts(): Promise<void> {
        this.reloadPrometheus();
        await this.cdRef.detectChanges();
    }

}

