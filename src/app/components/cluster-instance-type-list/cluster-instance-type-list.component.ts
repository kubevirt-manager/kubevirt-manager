import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVMClusterInstanceType } from 'src/app/models/kube-vmcluster-instance-type.model';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { VirtualMachineClusterInstanceType } from 'src/app/templates/virtual-machine-cluster-instance-type.apitemplate';

@Component({
  selector: 'app-cluster-instance-type-list',
  templateUrl: './cluster-instance-type-list.component.html',
  styleUrls: ['./cluster-instance-type-list.component.css']
})
export class ClusterInstanceTypeListComponent implements OnInit {

    clusterInstanceTypeList: KubeVMClusterInstanceType [] = [];

    myClusterInstanceTypeTemplate = new VirtualMachineClusterInstanceType().template;

    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private router: Router,
        private kubeVirtService: KubeVirtService
    ) { }

    ngOnInit(): void {
        this.getClusterInstanceTypes();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Cluster Instance Types");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Get the list of Instance Types
     */
    async getClusterInstanceTypes(): Promise<void> {
        let currentClusterInstanceType = new KubeVMClusterInstanceType;
        const data = await lastValueFrom(this.kubeVirtService.getClusterInstanceTypes());
        let types = data.items;
        for (let i = 0; i < types.length; i++) {
            currentClusterInstanceType = new KubeVMClusterInstanceType();
            currentClusterInstanceType.name = types[i].metadata["name"];
            currentClusterInstanceType.cpu = types[i].spec.cpu["guest"];
            currentClusterInstanceType.memory = types[i].spec.memory["guest"];
            this.clusterInstanceTypeList.push(currentClusterInstanceType);
        }
    }

    /*
     * Show Edit Window
     */
    showEdit(typeName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-edit");
        let modalTitle = document.getElementById("edit-title");
        let modalBody = document.getElementById("edit-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Edit: " + typeName);
        }
        if(modalBody != null) {
            let editTypeField = document.getElementById("edit-type");
            if(editTypeField != null) {
                editTypeField.setAttribute("value", typeName);
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
     * Perform Edit
     */
    async applyEdit(cpuSize: string, memorySize: string): Promise<void> {
        let typeField = document.getElementById("edit-type");
        if(cpuSize != null && memorySize != null && typeField != null) {
            let typeName = typeField.getAttribute("value");
            if(typeName != null) {
                try {
                    const data = await lastValueFrom(this.kubeVirtService.editClusterInstanceType(typeName, cpuSize, memorySize));
                    this.hideComponent("model-edit");
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
    showDelete(typeName: string): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let deleteTypeInput = document.getElementById("delete-type");
            if(deleteTypeInput != null ) {
                deleteTypeInput.setAttribute("value", typeName);
                modalBody.replaceChildren("Are you sure you want to delete " + typeName + "?");
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
     * Perform Delete
     */
    async applyDelete(): Promise<void> {
        let typeField = document.getElementById("delete-type");
        if(typeField != null) {
            let typeName = typeField.getAttribute("value");
            if(typeName != null) {
                try {
                    const data = await lastValueFrom(await this.kubeVirtService.deleteClusterInstanceType(typeName));
                    this.hideComponent("model-delete");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show New Window
     */
    showNew(): void {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-new");
        let modalTitle = document.getElementById("new-title");
        if(modalTitle != null) {
            modalTitle.replaceChildren("New Cluster Instance Type");
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
     * Create the new type
     */
    async applyNew(typeName: string, typeCPU: string, typeMemory: string): Promise<void> {
        if(typeName != null && typeCPU != null && typeMemory != null) {
            this.myClusterInstanceTypeTemplate.metadata.name = typeName;
            this.myClusterInstanceTypeTemplate.spec.cpu.guest = Number(typeCPU);
            this.myClusterInstanceTypeTemplate.spec.memory.guest = typeMemory + "Gi";
            try {
                const data = await lastValueFrom(this.kubeVirtService.createClusterInstanceType(typeName, this.myClusterInstanceTypeTemplate));
                this.hideComponent("model-new");
                this.reloadComponent();
            } catch (e: any) {
                alert(e.error.message);
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
        this.myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);
    }
    
    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/citlist`]);
        })
    }
}
