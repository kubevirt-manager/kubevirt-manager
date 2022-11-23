import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KubeVirtService {

  constructor(private http: HttpClient) { }

  getVMs(): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    return this.http.get(`${baseUrl}/virtualmachines`);
  }

  getVMis(): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    return this.http.get(`${baseUrl}/virtualmachineinstances`);
  }

  getVMi(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}`);
  }

  startVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    const headers = {
      'content-type': 'application/merge-patch+json',
      'accept': 'application/json'
    };
    return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"running": true}}', { 'headers': headers } );
  }

  powerOnVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    return this.startVm(namespace, name);
  }

  stopVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    const headers = {
      'content-type': 'application/merge-patch+json',
      'accept': 'application/json'
    };
    return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"running": false}}', { 'headers': headers } );
  }

  powerOffVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    const headers = {
      'content-type': 'application/json',
      'accept': 'application/json'
    };
    let body = '{"gracePeriodSeconds":0,"propagationPolicy":"Background"}';
    return this.http.delete(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}`,  {'headers': headers, 'body': body});
  }

  pauseVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/subresources.kubevirt.io/v1';
    const headers = {
      'accept': 'application/json'
    };
    return this.http.put(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}/pause`, { 'headers': headers } );
  }

  unpauseVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/subresources.kubevirt.io/v1';
    const headers = {
      'accept': 'application/json'
    };
    return this.http.put(`${baseUrl}/namespaces/${namespace}/virtualmachineinstances/${name}/unpause`, { 'headers': headers } );
  }

  scaleVm(namespace: string, name: string, cores: string, threads: string, sockets: string, memory: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    const headers = {
      'content-type': 'application/merge-patch+json',
      'accept': 'application/json'
    };
    return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"template":{"spec":{"domain":{"cpu":{"sockets": '+sockets+',"cores": '+cores+',"threads": '+threads+'},"resources":{"requests":{"memory": "'+memory+'Gi"}}}}}}}', { 'headers': headers } );
  }

  deleteVm(namespace: string, name: string): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    return this.http.delete(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`);
  }

  createVm(namespace: string, name: string, vmvalue: Object): Observable<any> {
    var baseUrl ='/k8s/apis/kubevirt.io/v1';
    const headers = {
      'content-type': 'application/json',
      'accept': 'application/json'
    };
    return this.http.post(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, vmvalue, { 'headers': headers } );
  }

  getClusterInstanceTypes(): Observable<any> {
    var baseUrl ='/k8s/apis/instancetype.kubevirt.io/v1alpha1';
    return this.http.get(`${baseUrl}/virtualmachineclusterinstancetypes`);
  }

}
