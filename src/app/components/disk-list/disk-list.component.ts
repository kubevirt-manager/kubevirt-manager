import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { VMDisk } from 'src/app/models/vmdisk.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { K8sService } from 'src/app/services/k8s.service';

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

    constructor(
        private k8sService: K8sService,
        private k8sApisService: K8sApisService,
        private dataVolumesService: DataVolumesService,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getDVs();
        await this.getStorageClasses();
        await this.getNamespaces();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Virtual Machine Disks");
        }
    }

    /*
     * Get StorageClasses from Kubernetes
     */
    async getStorageClasses(): Promise<void> {
        const data = await lastValueFrom(this.k8sApisService.getStorageClasses());
        let scs = data.items;
        for (let i = 0; i < scs.length; i++) {
            this.storageClassesList.push(scs[i].metadata["name"]);
        }
    }

    /*
     * Get Namespaces from Kubernetes
     */
    async getNamespaces(): Promise<void> {
        const data = await lastValueFrom(this.k8sService.getNamespaces());
        let nss = data.items;
        for (let i = 0; i < nss.length; i++) {
          this.namespacesList.push(nss[i].metadata["name"]);
        }
    }

    /*
     * Get DataVolumes
     */
    async getDVs(): Promise<void> {
        const data = await lastValueFrom(this.dataVolumesService.getDataVolumes());
        let disks = data.items;
        let currentDisk = new VMDisk;
        for (let i = 0; i < disks.length; i++) {
            currentDisk = new VMDisk();
            currentDisk["namespace"] = disks[i].metadata["namespace"];
            currentDisk["name"] = disks[i].metadata["name"];
            currentDisk["status"] = disks[i].status["phase"];
            currentDisk["progress"] = disks[i].status["progress"];;
            currentDisk["storageclass"] = disks[i].spec.pvc["storageClassName"];
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
    }

    /*
     * Show Resize Window
     */
    showResize(diskNamespace: string, diskName: string): void {
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
     * Hide Resize Window
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
                    let newSize = diskSize.trim() + "Gi"
                    const data = await lastValueFrom(this.k8sService.resizePersistentVolumeClaims(diskNamespace, diskName, newSize));
                    this.hideResize();
                    this.reloadComponent();
                } catch (e) {
                    if (e instanceof HttpErrorResponse) {
                        alert(e.error["message"])
                    } else {
                        console.log(e);
                        alert("Internal Error!");
                    }
                }
            }
        }
    }

    /*
     * Show Info Window
     */
    async showInfo(diskNamespace: string, diskName: string): Promise<void> {
        let myInnerHTML = "";
        let volumedata = await lastValueFrom(this.dataVolumesService.getDataVolumeInfo(diskNamespace, diskName));
        myInnerHTML += "<li class=\"nav-item\">Data Volume: <span class=\"float-right badge bg-primary\">" + volumedata.metadata["name"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Namespace: <span class=\"float-right badge bg-primary\">" + volumedata.metadata["namespace"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Creation Time: <span class=\"float-right badge bg-primary\">" + volumedata.metadata["creationTimestamp"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Storage Class: <span class=\"float-right badge bg-primary\">" + volumedata.spec.pvc["storageClassName"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">PVC: <span class=\"float-right badge bg-primary\">" + volumedata.status["claimName"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Phase: <span class=\"float-right badge bg-primary\">" + volumedata.status["phase"] + "</span></li>";
        if(volumedata.status["phase"].toLowerCase() == "succeeded") {
            let pvcdata = await lastValueFrom(this.k8sService.getPersistentVolumeClaimsInfo(diskNamespace, diskName));
            let pvdata = await lastValueFrom(this.k8sService.getPersistentVolumeInfo(pvcdata.spec["volumeName"]));
            myInnerHTML += "<li class=\"nav-item\">PV: <span class=\"float-right badge bg-primary\">" + pvcdata.spec["volumeName"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Volume Mode: <span class=\"float-right badge bg-primary\">" + pvcdata.spec["volumeMode"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Driver: <span class=\"float-right badge bg-primary\">" + pvdata.spec.csi["driver"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Reclaim Policy: <span class=\"float-right badge bg-primary\">" + pvdata.spec["persistentVolumeReclaimPolicy"] + "</span></li>";
        }
        let modalDiv = document.getElementById("modal-info");
        let modalTitle = document.getElementById("info-title");
        let modalBody = document.getElementById("info-cards");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Disk: " + diskName);
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
     * Hide Info Window
     */
    hideInfo(): void {
        let modalDiv = document.getElementById("modal-info");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
        }
    }

    /*
     * Show New Window
     */
    async showNew(): Promise<void> {
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
     * Hide New Window
     */
    hideNew(): void {
        let modalDiv = document.getElementById("modal-new");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
        }
    }

  /*
   * Create the DataVolume
   */
  async applyNew(diskNamespace: string, diskName: string, diskSc: string, diskSize: string): Promise<void> {
    if(diskNamespace != null && diskSize != null && diskName != null && diskSc != null) {
        try {
            const data = await lastValueFrom(this.dataVolumesService.createBlankDataVolume(diskNamespace, diskName, diskSize, diskSc));
            this.hideNew();
            this.reloadComponent();
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                alert(e.error["message"])
            } else {
                console.log(e);
            alert("Internal Error!");
            }
        }
    }
  }

    /*
    * Show Delete Window
    */
    showDelete(diskNamespace: string, diskName: string): void {
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
                    this.hideDelete();
                    this.reloadComponent();
                } catch (e) {
                    if (e instanceof HttpErrorResponse) {
                        alert(e.error["message"])
                    } else {
                        console.log(e);
                        alert("Internal Error!");
                    }
                }
            }
        }
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/dsklist`]);
        })
    }

}
