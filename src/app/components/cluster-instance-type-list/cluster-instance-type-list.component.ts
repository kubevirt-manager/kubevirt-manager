import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KubeVMClusterInstanceType } from 'src/app/models/kube-vmcluster-instance-type.model';
import { KubeVirtService } from 'src/app/services/kube-virt.service';

@Component({
  selector: 'app-cluster-instance-type-list',
  templateUrl: './cluster-instance-type-list.component.html',
  styleUrls: ['./cluster-instance-type-list.component.css']
})
export class ClusterInstanceTypeListComponent implements OnInit {

    clusterInstanceTypeList: KubeVMClusterInstanceType [] = [];

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
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/citlist`]);
        })
    }
}
