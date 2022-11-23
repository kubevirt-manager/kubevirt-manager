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
import { ImageListComponent } from './components/image-list/image-list.component';
import { DiskListComponent } from './components/disk-list/disk-list.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClusterInstanceTypeListComponent } from './components/cluster-instance-type-list/cluster-instance-type-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    SideMenuComponent,
    MainFooterComponent,
    NodelistComponent,
    VmlistComponent,
    VNCViewerComponent,
    ImageListComponent,
    DiskListComponent,
    NetworkListComponent,
    DashboardComponent,
    ClusterInstanceTypeListComponent
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
