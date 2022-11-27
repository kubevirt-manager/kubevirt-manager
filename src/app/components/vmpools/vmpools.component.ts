import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVirtVM } from 'src/app/models/kube-virt-vm.model';
import { KubeVirtVMI } from 'src/app/models/kube-virt-vmi.model';
import { KubeVirtVMPool } from 'src/app/models/kube-virt-vmpool.model';
import { KubeVirtService } from 'src/app/services/kube-virt.service';

@Component({
  selector: 'app-vmpools',
  templateUrl: './vmpools.component.html',
  styleUrls: ['./vmpools.component.css']
})
export class VMPoolsComponent implements OnInit {

    poolList: KubeVirtVMPool[] = [];
    vmList: KubeVirtVM[] = [];

    constructor(
        private router: Router,
        private kubeVirtService: KubeVirtService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getPools();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Pools");
        }
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
            currentPool.replicas = pools[i].spec["replicas"];
            currentPool.running = pools[i].spec.virtualMachineTemplate.spec["running"];
            /* Getting VM Type */
            try {
                currentPool.instType = pools[i].spec.virtualMachineTemplate.spec.instancetype.name;
            } catch(e) {
                currentPool.instType = "custom";
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
                } catch (e) {
                    currentPool.sockets = 0;
                    currentPool.threads = 0;
                    currentPool.cores = 0;
                    currentPool.memory = "";
                }
            }
            await this.getPoolVM(currentPool.namespace, currentPool.name);
            currentPool.vmlist = this.vmList;
            console.log(currentPool);
            console.log(pools[i]);
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
        } else if (vmOperation == "delete") {
            const data = await lastValueFrom(this.kubeVirtService.deleteVm(vmNamespace, vmName));
            this.reloadComponent();
        }
    }

    /*
     * Pool Basic Operations (start, stop, etc...)
     */
    async poolOperations(poolOperation: string, poolNamespace: string, poolName: string): Promise<void> {
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
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/vmpools`]);
        })
    }

}
