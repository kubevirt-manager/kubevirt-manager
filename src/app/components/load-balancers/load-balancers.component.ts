import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadBalancerPort } from 'src/app/models/load-balancer-port.model';
import { LoadBalancer } from 'src/app/models/load-balancer.model';
import { K8sService } from 'src/app/services/k8s.service';
import { KubeVirtService } from 'src/app/services/kube-virt.service';
import { Services } from 'src/app/interfaces/services';
import { ServicesPort } from 'src/app/interfaces/services-port';

@Component({
  selector: 'app-load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.css']
})
export class LoadBalancersComponent implements OnInit {

    loadBalancerList: LoadBalancer[] = [];
    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);
    charDot = '.';

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private k8sService: K8sService,
        private kubeVirtService: KubeVirtService
    ) { }

    ngOnInit(): void {
        this.getLoadBalancers();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Load Balancers");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Get Services from Kubernetes
     */
    async getLoadBalancers(): Promise<void> {
        this.loadBalancerList = [];
        let currentLoadBalancer = new LoadBalancer;
        try {
            const data = await lastValueFrom(this.k8sService.getServices());
            let services = data.items;
            for(let i = 0; i < services.length; i++) {
                currentLoadBalancer = new LoadBalancer();
                currentLoadBalancer.name = services[i].metadata.name;
                currentLoadBalancer.namespace = services[i].metadata.namespace;
                currentLoadBalancer.creationTimestamp = new Date(services[i].metadata.creationTimestamp);
                currentLoadBalancer.type = services[i].spec.type;
                currentLoadBalancer.clusterIP = services[i].spec.clusterIP;
                if(services[i].spec.selector["kubevirt.io/vmpool"] != null) {
                    currentLoadBalancer.targetResource = services[i].spec.selector["kubevirt.io/vmpool"];
                } else if (services[i].spec.selector["cluster.x-k8s.io/cluster-name"] != null) {
                    currentLoadBalancer.targetResource = services[i].spec.selector["cluster.x-k8s.io/cluster-name"];
                } else if(services[i].spec.selector["kubevirt.io/domain"] != null) {
                    currentLoadBalancer.targetResource = services[i].spec.selector["kubevirt.io/domain"];
                }
                if(currentLoadBalancer.type.toLowerCase() == "loadbalancer" && services[i].status.loadBalancer.ingress[0].ip != null) {
                    currentLoadBalancer.loadBalancer = services[i].status.loadBalancer.ingress[0].ip;
                } else {
                    currentLoadBalancer.loadBalancer = "N/A";
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
        } catch (e: any) {
            console.log(e);
        }
    }

    /*
     * Show Info Window
     */
    async showInfo(lbNamespace: string, lbName: string): Promise<void> {
        clearInterval(this.myInterval);
        let myInnerHTML = "";
        try {
            let data = await lastValueFrom(this.k8sService.getService(lbNamespace, lbName));
            myInnerHTML += "<li class=\"nav-item\">Service: <span class=\"float-right badge bg-primary\">" + data.metadata["name"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Namespace: <span class=\"float-right badge bg-primary\">" + data.metadata["namespace"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Creation Time: <span class=\"float-right badge bg-primary\">" + data.metadata["creationTimestamp"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Type: <span class=\"float-right badge bg-primary\">" + data.spec["type"] + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">ClusterIP: <span class=\"float-right badge bg-primary\">" + data.spec["clusterIP"] + "</span></li>";

            myInnerHTML += "<li class=\"nav-item\">Protocol: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].protocol + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Port: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].port + "</span></li>";
            myInnerHTML += "<li class=\"nav-item\">Target Port: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].targetPort + "</span></li>";

            if(data.spec.selector["kubevirt.io/vmpool"] != null) {
                myInnerHTML += "<li class=\"nav-item\">Target VM Pool: <span class=\"float-right badge bg-primary\">" + data.spec.selector["kubevirt.io/vmpool"] + "</span></li>";
            } else if(data.spec.selector["kubevirt.io/domain"] != null) {
                myInnerHTML += "<li class=\"nav-item\">Target Instance: <span class=\"float-right badge bg-primary\">" + data.spec.selector["kubevirt.io/domain"] + "</span></li>";
            } else if(data.spec.selector["cluster.x-k8s.io/cluster-name"] != null) {
                myInnerHTML += "<li class=\"nav-item\">Target Cluster: <span class=\"float-right badge bg-primary\">" + data.spec.selector["cluster.x-k8s.io/cluster-name"] + "</span></li>";
            }

            if(data.spec["type"].toLowerCase() == "loadbalancer" && data.status.loadBalancer.ingress[0].ip != null) {
                myInnerHTML += "<li class=\"nav-item\">External IP: <span class=\"float-right badge bg-primary\">" + data.status.loadBalancer.ingress[0].ip + "</span></li>";
            } if(data.spec["type"].toLowerCase() == "nodeport" && data.spec.ports[0].nodePort != null) {
                myInnerHTML += "<li class=\"nav-item\">Node Port: <span class=\"float-right badge bg-primary\">" + data.spec.ports[0].nodePort + "</span></li>";
            }
        } catch (e: any) {
            console.log(e);
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
     * Show Delete Window
     */
    showDelete(lbNamespace: string, lbName: string): void {
        clearInterval(this.myInterval);
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
                modalBody.replaceChildren("Are you sure you want to delete Load Balancer " + lbNamespace + " - " + lbName + "?");
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
                    this.hideComponent("modal-delete");
                    this.reloadComponent();
                } catch (e: any) {
                    alert(e.error.message);
                    console.log(e);
                }
            }
        }
    }

    /*
     * Show Change Type Window
     */
    showType(lbNamespace: string, lbName: string): void {
        clearInterval(this.myInterval);
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
                    this.hideComponent("modal-type");
                    this.fullReload();
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
    async showNew(): Promise<void> {
        clearInterval(this.myInterval);
        let modalDiv = document.getElementById("modal-new");
        let modalTitle = document.getElementById("new-title");
        let modalBody = document.getElementById("new-value");
        let nsSelectorOptions = "<option>&nbsp</option>\n";

        let selectorNamespacesField = document.getElementById("newlb-namespace");

        /* Load Namespace List and Set Selector */
        try{
            let data = await lastValueFrom(this.k8sService.getNamespaces());
            for (let i = 0; i < data.items.length; i++) {
                nsSelectorOptions += "<option value=" + data.items[i].metadata["name"] +">" + data.items[i].metadata["name"] + "</option>\n";
            }
        } catch (e: any) {
            console.log(e);
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
     * Create New Service
     */
    async applyNew(
        newlbname: string,
        newlbnamespace: string,
        newlbtargetresourcetype: string,
        newlbtargetresource: string,
        newlbannotationskeyone: string,
        newlbannotationsvalueone: string,
        newlbannotationskeytwo: string,
        newlbannotationsvaluetwo: string,
        newlblabelkeyone: string,
        newlblabelvalueone: string,
        newlblabelkeytwo: string,
        newlblabelvaluetwo: string,
        newlbtargettype: string,
        newlbport: string,
        newlbtargetport: string,
        newlbtargetproto: string
        ): Promise<void> {
        if(newlbname == "") {
            alert("You must select a name for your Load Balancer!");
        } else if(newlbname.includes(this.charDot)) {
            alert("Your Load Balancer name should not have .(dot)!");
        } else if (newlbtargetresourcetype == "" || newlbtargetresource == "" || newlbtargettype == "" || newlbport == "" || newlbtargetport == "" || newlbtargetproto == "") {
            alert("Please select all the target properties!");
        } else {

            /* Port and Proto settings */
            let servicePort: ServicesPort = {
                port: Number(newlbport),
                targetPort: Number(newlbtargetport),
                protocol: newlbtargetproto
            };

            /* Load Custom Labels */
            let tmpLabels = {};
            if(newlblabelkeyone != "") {
                let thisLabel = {
                    [newlblabelkeyone]: newlblabelvalueone
                };
                Object.assign(tmpLabels, thisLabel);
            }
            if(newlblabelkeytwo != "") {
                let thisLabel = {
                    [newlblabelkeytwo]: newlblabelvaluetwo
                };
                Object.assign(tmpLabels, thisLabel);
            }


            /* Selector and Labels */            
            let thisSelector = {};
            if(newlbtargetresourcetype == "vmpool") {
                let vmPoolLabel = {
                    ["kubevirt.io/vmpool"]: newlbtargetresource
                };
                Object.assign(tmpLabels, vmPoolLabel);
                Object.assign(thisSelector, tmpLabels);
            } else if(newlbtargetresourcetype == "vminstance") {
                let vmInstanceLabel = {
                    ["kubevirt.io/domain"]: newlbtargetresource
                };
                Object.assign(tmpLabels, vmInstanceLabel);
                Object.assign(thisSelector, tmpLabels);
            } else if(newlbtargetresourcetype == "capk") {
                let thisSelector = {};
                let vmInstanceLabel = {
                    ["cluster.x-k8s.io/cluster-name"]: newlbtargetresource
                };
                Object.assign(tmpLabels, vmInstanceLabel);
                Object.assign(thisSelector, tmpLabels);
            }

            let kubevirtManagerLabel = {
                ["kubevirt-manager.io/managed"]: "true"
            };
            Object.assign(tmpLabels, kubevirtManagerLabel);


            /* Load Annotations */
            let tmpAnnotations = {};
            if(newlbannotationskeyone != "") {
                let thisAnnotation = {
                    [newlbannotationskeyone]: newlbannotationsvalueone
                };
                Object.assign(tmpAnnotations, thisAnnotation);
            }
            if(newlbannotationskeytwo != "") {
                let thisAnnotation = {
                    [newlbannotationskeytwo]: newlbannotationsvaluetwo
                };
                Object.assign(tmpAnnotations, thisAnnotation);
            }

            /* Build Service Payload */
            let myService: Services = {
                apiVersion: "v1",
                kind: "Service",
                metadata: {
                    name: newlbname,
                    namespace: newlbnamespace,
                    labels: tmpLabels,
                    annotations: tmpAnnotations
                },
                spec: {
                    type: newlbtargettype,
                    ports: [ servicePort ],
                    selector: thisSelector,
                }
            };

            try {
                let newLbData = await lastValueFrom(this.k8sService.createService(myService));
                this.hideComponent("modal-new");
                this.fullReload();
            } catch (e: any) {
                alert(e.error.message);
                console.log(e);
            }
        }
    }

    /*
     * New LB: Load Available Resources
     */
    async onChangeNamespaceOrResourceType(namespace: string, resourcetype: string) {
        let selectorPoolField = document.getElementById("newlb-targetresource");
        let resourceSelectorOptions = "";
        if (resourcetype == "vmpool") { /* Virtual Machine Pool */
            let data = await lastValueFrom(this.kubeVirtService.getVMPoolsNamespaced(namespace));
            let thisPoolList = data.items;
            for (let i = 0; i < thisPoolList.length; i++) {
                resourceSelectorOptions += "<option value=" + thisPoolList[i].metadata["name"] + ">" + thisPoolList[i].metadata["name"] + "</option>\n";
            }
        } else if (resourcetype == "vminstance") { /* Virtual Machine Instance */
            let data = await lastValueFrom(this.kubeVirtService.getVMsNamespaced(namespace));
            let thisVMList = data.items;
            for (let i = 0; i < thisVMList.length; i++) {
                resourceSelectorOptions += "<option value=" + thisVMList[i].metadata["name"] + ">" + thisVMList[i].metadata["name"] + "</option>\n";
            }
        } else if (resourcetype == "capk") {   /* Future Cluster API */
            let data = await lastValueFrom(this.kubeVirtService.getVMsNamespaced(namespace));
            let thisVMList = data.items;
            for (let i = 0; i < thisVMList.length; i++) {
                resourceSelectorOptions += "<option value=" + thisVMList[i].metadata["name"] + ">" + thisVMList[i].metadata["name"] + "</option>\n";
            }
        }
        if (selectorPoolField != null) {
            selectorPoolField.innerHTML = resourceSelectorOptions;
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
        await this.getLoadBalancers();
        await this.cdRef.detectChanges();
    }

    /*
     * full reload
     */
    fullReload(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/lblist`]);
        })
    }

}
