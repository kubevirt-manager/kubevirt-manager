import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { K8sApisService } from 'src/app/services/k8s-apis.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {

    crdList: any;
    networkCheck: boolean = false;
    capkCheck: boolean = false;
    imgCheck: boolean = false;

    constructor(
        private k8sApisService: K8sApisService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.loadCrds();
        this.checkNetwork();
        this.checkCapk();
        this.checkImage();
    }

    /*
     * Load CRDs
     */
    async loadCrds(): Promise<void> {
        try {
            const data = await lastValueFrom(this.k8sApisService.getCrds());
            this.crdList = data.items;
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Check Capk Support (few of the CRDs we use)
     */
    async checkCapk(): Promise<void> {
        let cluster: boolean = false;
        let kubeadm: boolean = false;
        let kubeadmcontrolplane: boolean = false;
        let machinedeployments: boolean = false;
        let kubevirtclusters: boolean = false;
        let kubevirtmachinetemplates: boolean = false;
        for (let i = 0; i < this.crdList.length; i++) {
            if(this.crdList[i].metadata["name"] == "clusters.cluster.x-k8s.io") {
                cluster = true;
            } else if(this.crdList[i].metadata["name"] == "kubeadmconfigs.bootstrap.cluster.x-k8s.io") {
                kubeadm = true;
            } else if(this.crdList[i].metadata["name"] == "kubeadmcontrolplanes.controlplane.cluster.x-k8s.io") {
                kubeadmcontrolplane = true;
            } else if(this.crdList[i].metadata["name"] == "machinedeployments.cluster.x-k8s.io") {
                machinedeployments = true;
            } else if(this.crdList[i].metadata["name"] == "kubevirtclusters.infrastructure.cluster.x-k8s.io") {
                kubevirtclusters = true;
            } else if(this.crdList[i].metadata["name"] == "kubevirtmachinetemplates.infrastructure.cluster.x-k8s.io") {
                kubevirtmachinetemplates = true;
            }
        }

        if(cluster && kubeadm && kubeadmcontrolplane && machinedeployments && kubevirtclusters && kubevirtmachinetemplates) {
            this.capkCheck = true;
        }
    }

    /*
     * Check Multus Support
     */
    async checkNetwork(): Promise<void> {
        for (let i = 0; i < this.crdList.length; i++) {
            if(this.crdList[i].metadata["name"] == "network-attachment-definitions.k8s.cni.cncf.io") {
                this.networkCheck = true;
            }
        }
    }

    /*
     * Check Images Support
     */
    async checkImage(): Promise<void> {
        for (let i = 0; i < this.crdList.length; i++) {
            if(this.crdList[i].metadata["name"] == "images.kubevirt-manager.io") {
                this.imgCheck = true;
            }
        }
    }
}
