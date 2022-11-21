import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { K8sNode } from 'src/app/models/k8s-node.model';
import { VMImage } from 'src/app/models/vmimage.model';
import { K8sService } from 'src/app/services/k8s.service';
import { WorkerService } from 'src/app/services/worker.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {

  nodeList: K8sNode[] = [];

  constructor(
    private k8sService: K8sService,
    private router: Router,
    private workerService: WorkerService
  ) { }

  async ngOnInit(): Promise<void> {

    await this.getNodes();
    await this.getImages();
    let navTitle = document.getElementById("nav-title");
    if(navTitle != null) {
      navTitle.replaceChildren("Virtual Machine Images");
    }
  }

  /*
   * Get nodes from Kubernetes
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
    this.getImages();
  }

  /*
   * Get images from our DaemonSet
   */
  async getImages(): Promise<void> {
    for(let i = 0; i < this.nodeList.length; i++) {
      let currentImg = new VMImage;
      let currentImgList: VMImage[] = [];
      const data = await lastValueFrom(await this.workerService.getImages(this.nodeList[i].name));
      let images = data;
      for (let j = 0; j < images.length; j++) {
        currentImg = new VMImage();
        currentImg.name = images[j]["name"];
        currentImg.size = images[j]["size"];
        currentImg.path = images[j]["path"];
        currentImg.node = this.nodeList[i].name;
        currentImgList.push(currentImg);
      }
      this.nodeList[i].imglist = currentImgList;
    }
  }

  /*
   * Show Rename Window
   */
  showRename(imgName: string, nodeName: string): void {
    let modalDiv = document.getElementById("modal-rename");
    let modalTitle = document.getElementById("rename-title");
    let modalBody = document.getElementById("rename-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Rename: " + imgName);
    }
    if(modalBody != null) {
      let srcName = document.getElementById("src-name");
      let imgNode = document.getElementById("img-node");
      if(srcName != null && imgNode != null) {
        srcName.setAttribute("value", imgName);
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
   * Hide Rename Window
   */
  hideRename(): void {
    let modalDiv = document.getElementById("modal-rename");
    if(modalDiv != null) {
      modalDiv.setAttribute("class", "modal fade");
      modalDiv.setAttribute("aria-modal", "false");
      modalDiv.setAttribute("role", "");
      modalDiv.setAttribute("aria-hidden", "true");
      modalDiv.setAttribute("style","display: none;");
    }
  }

  /*
   * Send rename to our DaemonSet
   */
  async applyRename(dstName: string): Promise<void> {
    let srcField = document.getElementById("src-name");
    let nodeField = document.getElementById("img-node");
    if(srcField != null && nodeField != null && dstName != null) {
      let nodeName = nodeField.getAttribute("value");
      let srcName = srcField.getAttribute("value");
      if(srcName != null && dstName != null && nodeName != null) {
        if(dstName.toLowerCase().endsWith("img") || dstName.toLowerCase().endsWith("qcow2")) {
          try {
            const data = await lastValueFrom(await this.workerService.renameImage(nodeName, srcName, dstName));
            this.hideRename();
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
          alert("Invalid file name!");
        }
      }
    }
  }

  /*
   * Show Info Window
   */
  async showInfo(imgName: string, nodeName: string): Promise<void> {
    const data = await lastValueFrom(await this.workerService.getImageInfo(nodeName, imgName));
    let modalDiv = document.getElementById("modal-info");
    let modalTitle = document.getElementById("info-title");
    let modalBody = document.getElementById("info-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Image: " + imgName);
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
   * Show Delete Window
   */
  showDelete(imgName: string, nodeName: string): void {
    let modalDiv = document.getElementById("modal-delete");
    let modalTitle = document.getElementById("delete-title");
    let modalBody = document.getElementById("delete-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Delete!");
    }
    if(modalBody != null) {
      let imgNameInput = document.getElementById("delete-image");
      let nodeNameInput = document.getElementById("delete-node");
      if(imgNameInput != null && nodeNameInput != null) {
        imgNameInput.setAttribute("value", imgName);
        nodeNameInput.setAttribute("value", nodeName);
        modalBody.replaceChildren("Are you sure you want to delete " + imgName + "?");
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
    let imgField = document.getElementById("delete-image");
    let nodeField = document.getElementById("delete-node");
    if(imgField != null && nodeField != null) {
      let nodeName = nodeField.getAttribute("value");
      let imgName = imgField.getAttribute("value");
      if(imgName != null && nodeName != null) {
        try {
          const data = await lastValueFrom(await this.workerService.deleteImage(nodeName, imgName));
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
   * Show Upload Window
   */
  showUpload(nodeName: string): void {
    let modalDiv = document.getElementById("modal-upload");
    let modalTitle = document.getElementById("upload-title");
    let modalBody = document.getElementById("upload-value");
    if(modalTitle != null) {
      modalTitle.replaceChildren("Upload image file");
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
        if(fileName.toLowerCase().endsWith(".img")) {
          try {
            const data = await lastValueFrom(await this.workerService.uploadImage(nodeName, fileName, formData));
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
          alert("Image file needs to end with .img!");
        }
      }
    }
  }

  /*
   * Reload this component
   */
  reloadComponent(): void {
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate([`/imglist`]);
    })
  }

}
