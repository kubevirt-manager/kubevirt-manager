import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { K8sApisService } from 'src/app/services/k8s-apis.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {

    networkCheck: boolean = false;

    constructor(
        private k8sApisService: K8sApisService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.checkNetwork();
    }

    /*
     * Check Multus Support
    */
     async checkNetwork(): Promise<void> {
        const data = await lastValueFrom(this.k8sApisService.getCrds());
        let crds = data.items;
        for (let i = 0; i < crds.length; i++) {
            if(crds[i].metadata["name"] == "network-attachment-definitions.k8s.cni.cncf.io") {
                this.networkCheck = true;
            }
        }
    }
}
