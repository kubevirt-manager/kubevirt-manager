import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClusterInstanceTypeListComponent } from './components/cluster-instance-type-list/cluster-instance-type-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DiskListComponent } from './components/disk-list/disk-list.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NodelistComponent } from './components/nodelist/nodelist.component';
import { VmlistComponent } from './components/vmlist/vmlist.component';
import { VNCViewerComponent } from './components/vncviewer/vncviewer.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vmlist', component: VmlistComponent },
  { path: 'nodelist', component: NodelistComponent },
  { path: 'imglist', component: ImageListComponent },
  { path: 'dsklist', component: DiskListComponent },
  { path: 'netlist', component: NetworkListComponent },
  { path: 'vncviewer/:namespace/:name', component: VNCViewerComponent },
  { path: 'citlist', component: ClusterInstanceTypeListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
