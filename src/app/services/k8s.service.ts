import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl ='/k8s/api/v1'

@Injectable({
  providedIn: 'root'
})
export class K8sService {

  constructor(private http: HttpClient) { }

  getNodes(): Observable<any> {
    return this.http.get(`${baseUrl}/nodes`);
  }

  getNamespaces(): Observable<any> {
    return this.http.get(`${baseUrl}/namespaces`);
  }

  getNodeInfo(nodeName: string): Observable<any> {
    return this.http.get(`${baseUrl}/nodes/${nodeName}`);
  }

  getPersistentVolumes(): Observable<any> {
    return this.http.get(`${baseUrl}/persistentvolumes`);      
  }

  getPersistentVolumeInfo(volume: string): Observable<any> {
    return this.http.get(`${baseUrl}/persistentvolumes/${volume}`);      
  }

  deletePersistentVolume(volume: string): Observable<any> {
    return this.http.delete(`${baseUrl}/persistentvolumes/${volume}`);      
  }

  getPersistentVolumeClaims(): Observable<any> {
    return this.http.get(`${baseUrl}/persistentvolumeclaims`);
  }

  getPersistentVolumeClaimsInfo(namespace: string, name: string): Observable<any> {
    return this.http.get(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`);
  }

  deletePersistentVolumeClaims(namespace: string, name: string): Observable<any> {
    return this.http.delete(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`);
  }

  resizePersistentVolumeClaims(namespace: string, name: string, size: string): Observable<any> {
    const headers = {
        'content-type': 'application/merge-patch+json',
        'accept': 'application/json'
    };
    return this.http.patch(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`, '{"spec":{"resources":"requests":{"storage":" '+size+'"}}}', { 'headers': headers } );
  }

}
