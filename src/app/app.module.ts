import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { NodelistComponent } from './components/nodelist/nodelist.component';
import { VmlistComponent } from './components/vmlist/vmlist.component';
import { VNCViewerComponent } from './components/vncviewer/vncviewer.component';
import { DiskListComponent } from './components/disk-list/disk-list.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClusterInstanceTypeListComponent } from './components/cluster-instance-type-list/cluster-instance-type-list.component';
import { VMPoolsComponent } from './components/vmpools/vmpools.component';
import { LoadBalancersComponent } from './components/load-balancers/load-balancers.component';
import { RefreshComponent } from './components/refresh/refresh.component';
import { AutoscaleComponent } from './components/autoscale/autoscale.component';
import { VmpooldetailsComponent } from './components/vmpooldetails/vmpooldetails.component';
import { VmdetailsComponent } from './components/vmdetails/vmdetails.component';
import { KClusterComponent } from './components/kcluster/kcluster.component';
import { KClusterDetailsComponent } from './components/kcluster-details/kcluster-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    SideMenuComponent,
    MainFooterComponent,
    NodelistComponent,
    VmlistComponent,
    VNCViewerComponent,
    DiskListComponent,
    NetworkListComponent,
    DashboardComponent,
    ClusterInstanceTypeListComponent,
    VMPoolsComponent,
    LoadBalancersComponent,
    RefreshComponent,
    AutoscaleComponent,
    VmpooldetailsComponent,
    VmdetailsComponent,
    KClusterComponent,
    KClusterDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
