import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClusterInstanceTypeListComponent } from './components/cluster-instance-type-list/cluster-instance-type-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DiskListComponent } from './components/disk-list/disk-list.component';
import { LoadBalancersComponent } from './components/load-balancers/load-balancers.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NodelistComponent } from './components/nodelist/nodelist.component';
import { RefreshComponent } from './components/refresh/refresh.component';
import { VmlistComponent } from './components/vmlist/vmlist.component';
import { VMPoolsComponent } from './components/vmpools/vmpools.component';
import { VNCViewerComponent } from './components/vncviewer/vncviewer.component';
import { AutoscaleComponent } from './components/autoscale/autoscale.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vmlist', component: VmlistComponent },
  { path: 'vmpools', component: VMPoolsComponent},
  { path: 'autoscale', component: AutoscaleComponent},
  { path: 'nodelist', component: NodelistComponent },
  { path: 'dsklist', component: DiskListComponent },
  { path: 'netlist', component: NetworkListComponent },
  { path: 'lblist', component: LoadBalancersComponent},
  { path: 'citlist', component: ClusterInstanceTypeListComponent},
  { path: 'refresh', component: RefreshComponent},
  { path: 'vncviewer/:namespace/:name', component: VNCViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
