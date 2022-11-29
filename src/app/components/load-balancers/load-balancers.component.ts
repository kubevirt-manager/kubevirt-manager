import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { K8sService } from 'src/app/services/k8s.service';

@Component({
  selector: 'app-load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.css']
})
export class LoadBalancersComponent implements OnInit {

    constructor(
        private k8sService: K8sService,
        private router: Router
    ) { }

    ngOnInit(): void {
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Network");
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
