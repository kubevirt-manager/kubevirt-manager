import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { K8sHPA } from 'src/app/models/k8s-hpa.model';
import { K8sApisService } from 'src/app/services/k8s-apis.service';

@Component({
  selector: 'app-autoscale',
  templateUrl: './autoscale.component.html',
  styleUrls: ['./autoscale.component.css']
})
export class AutoscaleComponent implements OnInit {

    hpaList: K8sHPA[] = [];
    myInterval = setInterval(() =>{ this.reloadComponent(); }, 30000);

    constructor(
        private k8sApisService: K8sApisService,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getHPAs();
        let navTitle = document.getElementById("nav-title");
        if(navTitle != null) {
            navTitle.replaceChildren("Auto Scaling");
        }
    }

    ngOnDestroy() {
        clearInterval(this.myInterval);
    }

    /*
     * Load HPA List that is managed by us
     */
    async getHPAs(): Promise<void> {
        const data = await lastValueFrom(this.k8sApisService.getHpas());
        let hpas = data.items;
        for (let i = 0; i < hpas.length; i++) {
            let thisHpa = new K8sHPA();
            thisHpa.name = hpas[i].metadata["name"];
            thisHpa.namespace = hpas[i].metadata["namespace"];
            thisHpa.scaleTarget = hpas[i].spec.scaleTargetRef["name"]
            thisHpa.minReplicas = hpas[i].spec["minReplicas"]
            thisHpa.maxReplicas = hpas[i].spec["maxReplicas"]
            thisHpa.metricName = hpas[i].spec.metrics[0].resource["name"]
            thisHpa.metricType = hpas[i].spec.metrics[0].resource.target["type"]
            thisHpa.metricAvg = hpas[i].spec.metrics[0].resource.target["averageUtilization"]
            thisHpa.currentRpl = hpas[i].status["currentReplicas"]
            thisHpa.desiredRpl = hpas[i].status["desiredReplicas"]
            thisHpa.currAvgUtl = hpas[i].status.currentMetrics[0].resource.current["averageUtilization"]
            this.hpaList.push(thisHpa);
        }
    }

    /*
     * Reload this component
     */
    reloadComponent(): void {
        this.router.navigateByUrl('/refresh',{skipLocationChange:true}).then(()=>{
            this.router.navigate([`/autoscale`]);
        })
    }

}
