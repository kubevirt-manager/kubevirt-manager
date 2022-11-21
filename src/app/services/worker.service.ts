import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { K8sService } from './k8s.service';

const baseUrl ='/worker'
@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(
    private http: HttpClient,
    private k8sService: K8sService
  ) { }

  async getImages(nodename: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/images";
    return this.http.get(`${thisUrl}`, { 'headers': headers });
  }

  async getDisks(nodename: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disks";
    return this.http.get(`${thisUrl}`, { 'headers': headers });
  }

  async getDiskInfo(nodename: string, diskname: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + diskname;
    return this.http.get(`${thisUrl}`, { 'headers': headers });
  }

  async getImageInfo(nodename: string, imagename: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/image/" + imagename;
    return this.http.get(`${thisUrl}`, { 'headers': headers });
  }

  async renameImage(nodename: string, srcImage: string, dstImage: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/image/" + srcImage + "/" + dstImage;
    return this.http.patch(`${thisUrl}`, "", { 'headers': headers });
  }

  async resizeDisk(nodename: string, diskName: string, diskSize: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + diskName + "/" + diskSize;
    return this.http.patch(`${thisUrl}`, "", { 'headers': headers });
  }

  async deleteDisk(nodename: string, diskName: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + diskName;
    return this.http.delete(`${thisUrl}`, { 'headers': headers });
  }

  async deleteImage(nodename: string, imgName: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/image/" + imgName;
    return this.http.delete(`${thisUrl}`, { 'headers': headers });
  }

  async newBlankDisk(nodename: string, diskName: string, diskSize: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + diskName + "/" + diskSize;
    return this.http.put(`${thisUrl}`, "", { 'headers': headers });
  }

  async uploadImage(nodename: string, fileName: string, formData: FormData): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/image/" + fileName;
    return this.http.post(`${thisUrl}`,formData, { 'headers': headers });
  }

  async uploadDisk(nodename: string, fileName: string, formData: FormData): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + fileName;
    return this.http.post(`${thisUrl}`, formData, { 'headers': headers });
  }

  async createDiskFromImage(nodename: string, diskName: string, imageName: string, diskSize: string): Promise<Observable<any>> {
    let nodeIp = await this.getNodeIp(nodename);
    const headers = {
      'x-destination-node': nodeIp
    };
    var thisUrl = baseUrl + "/disk/" + diskName + "/" + imageName + "/" + diskSize;
    return this.http.put(`${thisUrl}`, "", { 'headers': headers });
  }

  async getNodeIp(nodeName: string) {
    let data = await lastValueFrom(this.k8sService.getNodeInfo(nodeName));
    var addresses = data.status.addresses;
    for(let i=0; i < addresses.length; i++) {
      let thisAddress = addresses[i];
      if(thisAddress["type"] == "InternalIP") {
        return thisAddress["address"].toString();
      }
    }
    return nodeName.toString();
  }
}

