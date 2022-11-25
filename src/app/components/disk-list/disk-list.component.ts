import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { VMDisk } from 'src/app/models/vmdisk.model';
import { DataVolumesService } from 'src/app/services/data-volumes.service';
import { K8sApisService } from 'src/app/services/k8s-apis.service';
import { K8sService } from 'src/app/services/k8s.service';
import { WorkerService } from 'src/app/services/worker.service';

@Component({
  selector: 'app-disk-list',
  templateUrl: './disk-list.component.html',
  styleUrls: ['./disk-list.component.css']
})
export class DiskListComponent implements OnInit {

  nodeList: K8sNode[] = [];
  diskList: VMDisk[] = [];

  constructor(
    private k8sService: K8sService,
    private dataVolumesService: DataVolumesService,
    private router: Router,
    private workerService: WorkerService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getDVs();
    //await this.getNodes();
    //await this.getDisks();
    let navTitle = document.getElementById("nav-title");
    if(navTitle != null) {
      navTitle.replaceChildren("Virtual Machine Disks");
    }
  }

  /*
   * Get Nodes from Kubernetes
   */
  async getNodes(): Promise<void> {
    let currentNode = new K8sNode;
    const data = await lastValueFrom(this.k8sService.getNodes());
    let nodes = data.items;
    for (let i = 0; i < nodes.length; i++) {
      currentNode = new K8sNode();
      currentNode.name = nodes[i].metadata["name"];
      this.nodeList.push(currentNode);
    }
    this.getDisks();
  }

  /*
   * Get Disks from our DaemonSet
   */
  async getDisks(): Promise<void> {
    for(let i = 0; i < this.nodeList.length; i++) {
      let currentDsk = new VMDisk;
      let currentDskList: VMDisk[] = [];
      const data = await lastValueFrom(await this.workerService.getDisks(this.nodeList[i].name));
      let disks = data;
      for (let j = 0; j < disks.length; j++) {
        currentDsk = new VMDisk();
        currentDsk.name = disks[j]["name"];
        currentDsk.size = disks[j]["size"];
        //currentDsk.path = disks[j]["path"];
        //currentDsk.node = this.nodeList[i].name;
        currentDskList.push(currentDsk);
      }
      this.nodeList[i].disklist = currentDskList;
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
          const data = await lastValueFrom(this.k8sService.resizePersistentVolumeClaims(diskNamespace, diskName, diskSize));
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
  async showInfo(diskName: string, nodeName: string): Promise<void> {
    const data = await lastValueFrom(await this.workerService.getDiskInfo(nodeName, diskName));
    let modalDiv = document.getElementById("modal-info");
    let modalTitle = document.getElementById("info-title");
    let modalBody = document.getElementById("info-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Disk: " + diskName);
    }
    if(modalBody != null) {
      modalBody.innerText = data.message;
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
   * Show Upload Window
   */
  showUpload(nodeName: string): void {
    let modalDiv = document.getElementById("modal-upload");
    let modalTitle = document.getElementById("upload-title");
    let modalBody = document.getElementById("upload-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Upload disk file");
    }
    if(modalBody != null) {
      let imgNode = document.getElementById("upload-node");
      if(imgNode != null) {
        imgNode.setAttribute("value", nodeName);
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
   * Hide Upload Window
   */
  hideUpload(): void {
    let modalDiv = document.getElementById("modal-upload");
    if(modalDiv != null) {
      modalDiv.setAttribute("class", "modal fade");
      modalDiv.setAttribute("aria-modal", "false");
      modalDiv.setAttribute("role", "");
      modalDiv.setAttribute("aria-hidden", "true");
      modalDiv.setAttribute("style","display: none;");
    }
  }

  /*
   * Send upload to our DaemonSet
   */
  async applyUpload(uploadFile: HTMLInputElement): Promise<void> {
    let nodeField = document.getElementById("upload-node");
    if(nodeField != null && uploadFile != null && uploadFile.files != null) {
      const formData = new FormData();
      let fileName = "";
      let nodeName = nodeField.getAttribute("value");
      if (nodeName != null) {
        for (let i = 0; i < uploadFile.files.length; i++) {
          fileName = uploadFile.files[i].name;
          formData.append("file", uploadFile.files[i])
        }
        if(fileName.toLowerCase().endsWith(".img") || fileName.toLowerCase().endsWith("qcow2")) {
          try {
            const data = await lastValueFrom(await this.workerService.uploadDisk(nodeName, fileName, formData));
            this.hideUpload();
            this.reloadComponent();
          } catch (e) {
            if (e instanceof HttpErrorResponse) {
              alert(e.error["message"])
            } else {
              console.log(e);
              alert("Internal Error!");
            }
          }
        } else {
          alert("Image file needs to end with .img or .qcow2!");
        }
      }
    }
  }

  /*
   * Show New Window
   */
  showNew(nodeName: string): void {
    let modalDiv = document.getElementById("modal-new");
    let modalTitle = document.getElementById("new-title");
    let modalBody = document.getElementById("new-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("New Blank Disk");
    }
    if(modalBody != null) {
      let nodeInput = document.getElementById("new-node");
      if(nodeInput != null) {
        nodeInput.setAttribute("value", nodeName);
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
   * Send new disk to our DaemonSet
   */
  async applyNew(diskNamespace: string, diskName: string, diskSize: string): Promise<void> {
    if(diskNamespace != null && diskSize != null && diskName != null) {
        try {
            const data = await lastValueFrom(await this.workerService.newBlankDisk(diskNamespace, diskName, diskSize));
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
      modalTitle.replaceChildren("Delete!");
    }
    if(modalBody != null) {
      let diskNamespaceInput = document.getElementById("delete-namespace");
      let diskNameInput = document.getElementById("delete-disk");
      if(diskNameInput != null && diskNamespaceInput != null) {
        diskNamespaceInput.setAttribute("value", diskNamespace);
        diskNameInput.setAttribute("value", diskName);
        modalBody.replaceChildren("Are you sure you want to delete <strong>" + diskNamespace + " - " + diskName + "</strong>?");
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
   * Send delete request to our DaemonSet
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
