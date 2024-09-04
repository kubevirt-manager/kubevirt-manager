import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { VMDisk } from 'src/app/models/vmdisk.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { K8sService } from 'src/app/services/k8s.service';
import { DataVolume } from 'src/app/interfaces/data-volume';

@Component({
  selector: 'app-disk-list',
  templateUrl: './disk-list.component.html',
  styleUrls: ['./disk-list.component.css']
})
export class DiskListComponent implements OnInit {

    nodeList: K8sNode[] = [];
    diskList: VMDisk[] = [];
    storageClassesList: string[] = [];
    namespacesList: string[] = [];
    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private k8sService: K8sService,
        private k8sApisService: K8sApisService,
        private dataVolumesService: DataVolumesService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getDVs();
        await this.getStorageClasses();
        await this.getNamespaces();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Data Volumes");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }
    
    /*
     * Get StorageClasses from Kubernetes
     */
    async getStorageClasses(): Promise<void> {
        try {
            const data = await lastValueFrom(this.k8sApisService.getStorageClasses());
            let scs = data.items;
            for (let i = 0; i < scs.length; i++) {
                this.storageClassesList.push(scs[i].metadata["name"]);
            }
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Get Namespaces from Kubernetes
     */
    async getNamespaces(): Promise<void> {
        try {
            const data = await lastValueFrom(this.k8sService.getNamespaces());
            let nss = data.items;
            for (let i = 0; i < nss.length; i++) {
            this.namespacesList.push(nss[i].metadata["name"]);
            }
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Get DataVolumes
     */
    async getDVs(): Promise<void> {
        this.diskList = [];
        try {
            const data = await lastValueFrom(this.dataVolumesService.getDataVolumes());
            let disks = data.items;
            let currentDisk = new VMDisk;
            for (let i = 0; i < disks.length; i++) {
                currentDisk = new VMDisk();
                currentDisk["namespace"] = disks[i].metadata["namespace"];
                currentDisk["name"] = disks[i].metadata["name"];
                currentDisk["status"] = disks[i].status["phase"];
                currentDisk["progress"] = disks[i].status["progress"];
                try {                
                    currentDisk["storageClass"] = disks[i].spec.pvc["storageClassName"];
                    currentDisk["accessMode"] = disks[i].spec.pvc.accessModes[0];
                } catch (e: any) {
                    currentDisk["storageClass"] = disks[i].spec.storage["storageClassName"];
                    currentDisk["accessMode"] = disks[i].spec.storage.accessModes[0];
                }
                currentDisk["bound"] = false;
                if(disks[i].status["phase"].toLowerCase() == "succeeded") {
                    let pvcdata = await lastValueFrom(this.k8sService.getPersistentVolumeClaimsInfo(currentDisk["namespace"], currentDisk["name"]));
                    currentDisk["succeeded"] = true;
                    currentDisk["size"] = currentDisk["size"] = pvcdata.spec.resources.requests["storage"];
                    if(pvcdata.status["phase"].toLowerCase() == "bound") {
                        currentDisk["bound"] = true;                
                    }
                } else {
                    currentDisk["succeeded"] = false;
                    currentDisk["size"] = disks[i].spec.pvc.resources.requests["storage"];
                }
                this.diskList.push(currentDisk);
            }
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Show Resize Window
     */
    showResize(diskNamespace: string, diskName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-resize");
        let modalTitle = document.getElementById("resize-title");
        let modalBody = document.getElementById("resize-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Resize: "+ diskNamespace + " - " + diskName);
        }
        if(modalBody != null) {
            let resizeNamespace = document.getElementById("resize-namespace");
            let resizeDisk = document.getElementById("resize-disk");
            if(resizeDisk != null && resizeNamespace != null) {
                resizeDisk.setAttribute("value", diskName);
                resizeNamespace.setAttribute("value", diskNamespace);
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
     * Perform Resize of PVC
     */
    async applyResize(diskSize: string): Promise<void> {
        let diskField = document.getElementById("resize-disk");
        let diskNamesField = document.getElementById("resize-namespace");
        if(diskSize != null && diskField != null && diskNamesField != null) {
            let diskNamespace = diskNamesField.getAttribute("value");
            let diskName = diskField.getAttribute("value");
            if(diskSize != null && diskName != null && diskNamespace != null) {
                try {
                    let newSize = diskSize.trim() + "Gi";
                    const data = await lastValueFrom(this.k8sService.resizePersistentVolumeClaims(diskNamespace, diskName, newSize));
                    this.hideComponent("modal-resize");
                    this.fullReload();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Info Window
     */
    async showInfo(diskNamespace: string, diskName: string): Promise<void> {
        clearInterval(this.myInterval);
        let myInnerHTML = "";
        let volumedata = await lastValueFrom(this.dataVolumesService.getDataVolumeInfo(diskNamespace, diskName));
        myInnerHTML += "<li class=\"nav-item\">Data Volume: <span class=\"float-right badge bg-primary\">" + volumedata.metadata["name"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Namespace: <span class=\"float-right badge bg-primary\">" + volumedata.metadata["namespace"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Creation Time: <span class=\"float-right badge bg-primary\">" + new Date(volumedata.metadata["creationTimestamp"]) + "</span></li>";
        try {
            myInnerHTML += "<li class=\"nav-item\">Storage Class: <span class=\"float-right badge bg-primary\">" + volumedata.spec.pvc["storageClassName"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Access Mode: <span class=\"float-right badge bg-primary\">" + volumedata.spec.pvc.accessModes[0] + "</span></li>";
        } catch (e: any) {
            myInnerHTML += "<li class=\"nav-item\">Storage Class: <span class=\"float-right badge bg-primary\">" + volumedata.spec.storage["storageClassName"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Access Mode: <span class=\"float-right badge bg-primary\">" + volumedata.spec.storage.accessModes[0] + "</span></li>";
        }
        myInnerHTML += "<li class=\"nav-item\">PVC: <span class=\"float-right badge bg-primary\">" + volumedata.status["claimName"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Phase: <span class=\"float-right badge bg-primary\">" + volumedata.status["phase"] + "</span></li>";
        if(volumedata.status["phase"].toLowerCase() == "succeeded") {
            let pvcdata = await lastValueFrom(this.k8sService.getPersistentVolumeClaimsInfo(diskNamespace, diskName));
            let pvdata = await lastValueFrom(this.k8sService.getPersistentVolumeInfo(pvcdata.spec["volumeName"]));
            myInnerHTML += "<li class=\"nav-item\">PV: <span class=\"float-right badge bg-primary\">" + pvcdata.spec["volumeName"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Volume Mode: <span class=\"float-right badge bg-primary\">" + pvcdata.spec["volumeMode"] + "</span></li>";
            if(pvdata.spec.csi != null) {
                myInnerHTML += "<li class=\"nav-item\">Driver: <span class=\"float-right badge bg-primary\">" + pvdata.spec.csi["driver"] + "</span></li>";
            }
            if(pvdata.spec.nfs != null) {
                myInnerHTML += "<li class=\"nav-item\">NFS Server: <span class=\"float-right badge bg-primary\">" + pvdata.spec.nfs["server"] + "</span></li>";
                myInnerHTML += "<li class=\"nav-item\">NFS Path: <span class=\"float-right badge bg-primary\">" + pvdata.spec.nfs["path"] + "</span></li>";
            }            
            myInnerHTML += "<li class=\"nav-item\">Reclaim Policy: <span class=\"float-right badge bg-primary\">" + pvdata.spec["persistentVolumeReclaimPolicy"] + "</span></li>";
        }
        let modalDiv = document.getElementById("modal-info");
        let modalTitle = document.getElementById("info-title");
        let modalBody = document.getElementById("info-cards");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Disk: " + diskNamespace + " - " + diskName);
        }
        if(modalBody != null) {
            modalBody.innerHTML = myInnerHTML;
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
     * Show New Window
     */
    async showNew(): Promise<void> {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-new");
        let modalTitle = document.getElementById("new-title");
        let modalBody = document.getElementById("new-value");
        let selectorNamespacesField = document.getElementById("new-disk-namespace");
        let selectorStorageClassField = document.getElementById("new-disk-storageclass");
        let i = 0;
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Blank Disk");
        }

        /* Load Namespace List and Set Selector */
        let nsSelectorOptions = "";
        for (i = 0; i < this.namespacesList.length; i++) {
            nsSelectorOptions += "<option value=" + this.namespacesList[i] +">" + this.namespacesList[i] + "</option>\n";
        }
        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        /* Load StorageClass List and Set Selector */
        let scSelectorOptions = "";
        for (i = 0; i < this.storageClassesList.length; i++) {
            scSelectorOptions += "<option value=" + this.storageClassesList[i] +">" + this.storageClassesList[i] + "</option>\n";
        }
        if (selectorStorageClassField != null) {
            selectorStorageClassField.innerHTML = scSelectorOptions;
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
     * Create the DataVolume
     */
    async applyNew(diskNamespace: string, diskName: string, diskSc: string, diskAm: string, diskSize: string): Promise<void> {
        if(diskNamespace != null && diskSize != null && diskName != null && diskSc != null) {
            let thisDv: DataVolume = {
                apiVersion: "cdi.kubevirt.io/v1beta1",
                kind: "DataVolume",
                metadata: {
                    name: diskName,
                    namespace: diskNamespace,
                    annotations: {
                        "cdi.kubevirt.io/storage.deleteAfterCompletion": "false",
                    },
                    labels: {},
                },
                spec: {
                    pvc: {
                        storageClassName: diskSc,
                        accessModes:[
                            diskAm
                        ],
                        resources: {
                            requests: {
                                storage: diskSize + "Gi",
                            },
                        },
                    },
                    source: {
                        blank: {}
                    }
                }
            };
        
            try {
                const data = await lastValueFrom(this.dataVolumesService.createDataVolume(thisDv));
                this.hideComponent("modal-new");
                this.fullReload();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        }
    }

    /*
    * Show Delete Window
    */
    showDelete(diskNamespace: string, diskName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let diskNamespaceInput = document.getElementById("delete-namespace");
            let diskNameInput = document.getElementById("delete-disk");
            if(diskNameInput != null && diskNamespaceInput != null) {
                diskNamespaceInput.setAttribute("value", diskNamespace);
                diskNameInput.setAttribute("value", diskName);
                modalBody.replaceChildren("Are you sure you want to delete " + diskNamespace + " - " + diskName + "?");
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
     * Delete DV, PV, PVC
     */
    async applyDelete(): Promise<void> {
        let diskField = document.getElementById("delete-disk");
        let namespaceField = document.getElementById("delete-namespace");
        if(diskField != null && namespaceField != null) {
            let diskNamespace = namespaceField.getAttribute("value");
            let diskName = diskField.getAttribute("value");
            if(diskName != null && diskNamespace != null) {
                try {
                    let volumedata = await lastValueFrom(this.dataVolumesService.getDataVolumeInfo(diskNamespace, diskName));
                    if(volumedata.status["phase"].toLowerCase() == "succeeded") {
                        let pvcdata = await lastValueFrom(this.k8sService.getPersistentVolumeClaimsInfo(diskNamespace, diskName));
                        let pv = pvcdata.spec["volumeName"];
                        let deleteData = await lastValueFrom(this.k8sService.deletePersistentVolumeClaims(diskNamespace, diskName));
                        deleteData = await lastValueFrom(this.k8sService.deletePersistentVolume(pv));
                    }
                    let deleteDataVolume = await lastValueFrom(this.dataVolumesService.deleteDataVolume(diskNamespace, diskName));
                    this.hideComponent("modal-delete");
                    this.fullReload();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
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
        this.myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);
    }

    /*
     * Reload this component
     */
    async reloadComponent(): Promise<void> {
        await this.getDVs();
        await this.getStorageClasses();
        await this.cdRef.detectChanges();
    }

    /*
     * full reload
     */
    fullReload(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/dsklist`]);
        })
    }

}
