import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadBalancerPort } from 'src/app/models/load-balancer-port.model';
import { LoadBalancer } from 'src/app/models/load-balancer.model';
import { K8sService } from 'src/app/services/k8s.service';
import { HttpErrorResponse } from '@angular/common/http';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { Services } from 'src/app/templates/services.apitemplate';

@Component({
  selector: 'app-load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.css']
})
export class LoadBalancersComponent implements OnInit {

    loadBalancerList: LoadBalancer[] = [];

    constructor(
        private k8sService: K8sService,
        private router: Router,
        private kubeVirtService: KubeVirtService
    ) { }

    ngOnInit(): void {
        this.getLoadBalancers();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Load Balancers");
        }
    }

    /*
     * Get Services from Kubernetes
     */
    async getLoadBalancers(): Promise<void> {
        let currentLoadBalancer = new LoadBalancer;
        const data = await lastValueFrom(this.k8sService.getServices());
        let services = data.items;
        for(let i = 0; i < services.length; i++) {
            currentLoadBalancer = new LoadBalancer();
            currentLoadBalancer.name = services[i].metadata.name;
            currentLoadBalancer.namespace = services[i].metadata.namespace;
            currentLoadBalancer.type = services[i].spec.type;
            currentLoadBalancer.clusterIP = services[i].spec.clusterIP;
            if(services[i].spec.selector["kubevirt.io/vmpool"] != null) {
                currentLoadBalancer.targetPool = services[i].spec.selector["kubevirt.io/vmpool"];
            }
            if(currentLoadBalancer.type.toLowerCase() == "loadbalancer" && services[i].status.loadBalancer.ingress[0].ip != null) {
                currentLoadBalancer.loadBalancer = services[i].status.loadBalancer.ingress[0].ip;
            }
            let servicePorts = services[i].spec.ports;
            for(let j = 0; j < servicePorts.length; j++) {
                let thisPort = new LoadBalancerPort();
                if(servicePorts[j].name != null) {
                    thisPort.name = servicePorts[j].name;
                }
                thisPort.protocol = servicePorts[j].protocol;
                thisPort.listenport = servicePorts[j].port;
                thisPort.targetport = servicePorts[j].targetPort;
                currentLoadBalancer.ports.push(thisPort);
            }
            this.loadBalancerList.push(currentLoadBalancer);
        }
    }

    /*
     * Show Info Window
     */
    async showInfo(lbNamespace: string, lbName: string): Promise<void> {
        let myInnerHTML = "";
        let data = await lastValueFrom(this.k8sService.getService(lbNamespace, lbName));
        myInnerHTML += "<li class=\"nav-item\">Load Balancer: <span class=\"float-right badge bg-primary\">" + data.metadata["name"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Namespace: <span class=\"float-right badge bg-primary\">" + data.metadata["namespace"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Creation Time: <span class=\"float-right badge bg-primary\">" + data.metadata["creationTimestamp"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Type: <span class=\"float-right badge bg-primary\">" + data.spec["type"] + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">ClusterIP: <span class=\"float-right badge bg-primary\">" + data.spec["clusterIP"] + "</span></li>";

        myInnerHTML += "<li class=\"nav-item\">Protocol: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].protocol + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Port: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].port + "</span></li>";
        myInnerHTML += "<li class=\"nav-item\">Target Port: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].targetPort + "</span></li>";

        if(data.spec.selector["kubevirt.io/vmpool"] != null) {
            myInnerHTML += "<li class=\"nav-item\">Target VM Pool: <span class=\"float-right badge bg-primary\">" + data.spec.selector["kubevirt.io/vmpool"] + "</span></li>";
        }

        if(data.spec["type"].toLowerCase() == "loadbalancer" && data.status.loadBalancer.ingress[0].ip != null) {
            myInnerHTML += "<li class=\"nav-item\">External IP: <span class=\"float-right badge bg-primary\">" + data.status.loadBalancer.ingress[0].ip + "</span></li>";
        }

        let modalDiv = document.getElementById("modal-info");
        let modalTitle = document.getElementById("info-title");
        let modalBody = document.getElementById("info-cards");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Load Balancer: " + lbName);
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
     * Show Delete Window
     */
    showDelete(lbNamespace: string, lbName: string): void {
        let modalDiv = document.getElementById("modal-delete");
        let modalTitle = document.getElementById("delete-title");
        let modalBody = document.getElementById("delete-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Delete");
        }
        if(modalBody != null) {
            let lbNamespaceInput = document.getElementById("delete-namespace");
            let lbNameInput = document.getElementById("delete-name");
            if(lbNameInput != null && lbNamespaceInput != null) {
                lbNamespaceInput.setAttribute("value", lbNamespace);
                lbNameInput.setAttribute("value", lbName);
                modalBody.replaceChildren("Are you sure you want to delete " + lbNamespace + " - " + lbName + "?");
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
     * Delete Kubernetes Service
     */
    async applyDelete(): Promise<void> {
        let nameField = document.getElementById("delete-name");
        let namespaceField = document.getElementById("delete-namespace");
        if(nameField != null && namespaceField != null) {
            let lbNamespace = namespaceField.getAttribute("value");
            let lbName = nameField.getAttribute("value");
            if(lbName != null && lbNamespace != null) {
                try {
                    let deleteService = await lastValueFrom(this.k8sService.deleteService(lbNamespace, lbName));
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
     * Show Change Type Window
     */
    showType(lbNamespace: string, lbName: string): void {
        let modalDiv = document.getElementById("modal-type");
        let modalTitle = document.getElementById("type-title");
        let modalBody = document.getElementById("type-value");
        if(modalTitle != null) {
            modalTitle.replaceChildren("Config");
        }
        if(modalBody != null) {
            let lbNamespaceInput = document.getElementById("type-namespace");
            let lbNameInput = document.getElementById("type-name");
            if(lbNameInput != null && lbNamespaceInput != null) {
                lbNamespaceInput.setAttribute("value", lbNamespace);
                lbNameInput.setAttribute("value", lbName);
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
     * Hide Change Type Window
     */
    hideType(): void {
        let modalDiv = document.getElementById("modal-type");
        if(modalDiv != null) {
            modalDiv.setAttribute("class", "modal fade");
            modalDiv.setAttribute("aria-modal", "false");
            modalDiv.setAttribute("role", "");
            modalDiv.setAttribute("aria-hidden", "true");
            modalDiv.setAttribute("style","display: none;");
        }
    }

    /*
     * Change Service Type
     */
    async applyType(newType: string): Promise<void> {
        let nameField = document.getElementById("type-name");
        let namespaceField = document.getElementById("type-namespace");
        if(nameField != null && namespaceField != null) {
            let lbNamespace = namespaceField.getAttribute("value");
            let lbName = nameField.getAttribute("value");
            if(lbName != null && lbNamespace != null) {
                try {
                    let newTypeData = await lastValueFrom(this.k8sService.changeServiceType(lbNamespace, lbName, newType));
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
     * Show New Window
     */
    async showNew(): Promise<void> {
        let modalDiv = document.getElementById("modal-new");
        let modalTitle = document.getElementById("new-title");
        let modalBody = document.getElementById("new-value");

        let selectorNamespacesField = document.getElementById("newlb-namespace");

        /* Load Namespace List and Set Selector */
        let data = await lastValueFrom(this.k8sService.getNamespaces());
        let nsSelectorOptions = "";
        for (let i = 0; i < data.items.length; i++) {
            nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
        }
        if (selectorNamespacesField != null) {
            selectorNamespacesField.innerHTML = nsSelectorOptions;
        }

        if(modalTitle != null) {
            modalTitle.replaceChildren("New Load Balancer");
            
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
     * Create New Service
     */
    async applyNew(
        newlbname: string,
        newlbnamespace: string,
        newlbtargetpool: string,
        newlbtargettype: string,
        newlbport: string,
        newlbtargetport: string,
        newlbtargetproto: string
        ): Promise<void> {
        if(newlbname == "") {
            alert("You must select a name for your Load Balancer!");
        } else if (newlbtargetpool == "" || newlbtargettype == "" || newlbport == "" || newlbtargetport == "" || newlbtargetproto == "") {
            alert("Please select all the target properties!")
        } else {
            let myServiceDescriptor = new Services();
            myServiceDescriptor.servicePortTemplate.port = Number(newlbport);
            myServiceDescriptor.servicePortTemplate.targetPort = Number(newlbtargetport);
            myServiceDescriptor.servicePortTemplate.protocol = newlbtargetproto;

            myServiceDescriptor.serviceTemplate.spec.ports.pop();
            myServiceDescriptor.serviceTemplate.spec.ports.push(myServiceDescriptor.servicePortTemplate);
            myServiceDescriptor.serviceTemplate.metadata.name = newlbname;
            myServiceDescriptor.serviceTemplate.metadata.namespace = newlbnamespace;
            myServiceDescriptor.serviceTemplate.spec.type = newlbtargettype;

            let tmpLabels = {};
            let kubevirtManagerLabel = {
                ["kubevirt-manager.io/managed"]: "true"
            };
            Object.assign(tmpLabels, kubevirtManagerLabel);
            let vmPoolLabel = {
                ["kubevirt.io/vmpool"]: newlbtargetpool
            };
            Object.assign(tmpLabels, vmPoolLabel);

            myServiceDescriptor.serviceTemplate.metadata.labels = tmpLabels;

            let thisSelector = {
                ["kubevirt.io/vmpool"]: newlbtargetpool
            };
            myServiceDescriptor.serviceTemplate.spec.selector = thisSelector;

            let myNewService = myServiceDescriptor.serviceTemplate;

            try {
                let newLbData = await lastValueFrom(this.k8sService.createService(newlbnamespace, myNewService));
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

    /*
     * New LB: Load Available Pools
     */
    async onChangeNamespace(namespace: string) {
        let selectorPoolField = document.getElementById("newlb-targetpool");
        let poolSelectorOptions = "";
        let data = await lastValueFrom(this.kubeVirtService.getVMPoolsNamespaced(namespace));
        let thisPoolList = data.items;
        for (let i = 0; i < thisPoolList.length; i++) {
            poolSelectorOptions += "<option value=" + thisPoolList[i].metadata["name"] + ">" + thisPoolList[i].metadata["name"] + "</option>\n";
        }
        if (selectorPoolField != null && poolSelectorOptions != "") {
            selectorPoolField.innerHTML = poolSelectorOptions;
        }
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/lblist`]);
        })
    }

}
