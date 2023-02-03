import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import RFB from '@novnc/novnc/core/rfb';

@Component({
  selector: 'app-vncviewer',
  templateUrl: './vncviewer.component.html',
  styleUrls: ['./vncviewer.component.css']
})

export class VNCViewerComponent implements OnInit {

    vmName: string = "";
    vmNamespace: string = "";

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {

        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("VNC Viewer");
        }

        this.vmName = this.route.snapshot.params['name'];
        this.vmNamespace = this.route.snapshot.params['namespace'];

        const host = window.location.hostname;
        const port = window.location.port;
        const rootPath = window.location.pathname.split('/').slice(1,-3).join('/'); // Dropping first `/` and trailing `/vncviewer/<vmNamespace>/<vmName>` from path to get back to "root"
        const path = rootPath + "/k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/" + this.vmNamespace + "/virtualmachineinstances/" + this.vmName + "/vnc";

        // Build the websocket URL used to connect
        let url = "ws";

        if (window.location.protocol === "https:") {
            url = "wss";
        } else {
         url = "ws";
        }

        url += "://" + host;
        if (port) {
            url += ":" + port;
        }
        url += "/" + path;

        // Creating a new RFB object will start a new connection
        let screenDiv = document.getElementById("screen");
        if(screenDiv != null) {
            let rfb = new RFB(screenDiv, url);
        }
    }
}
