import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataVolumesService {

    constructor(private http: HttpClient) { }

    getDataVolumes(): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/datavolumes`);
    }

    infoDataVolume(namespace: string, name: string): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`);
    }


    startVm(namespace: string, name: string): Observable<any> {
        var baseUrl ='/k8s/apis/kubevirt.io/v1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"running": true}}', { 'headers': headers } );
    }

    changeVmType(namespace: string, name: string, type: string): Observable<any> {
        var baseUrl ='/k8s/apis/kubevirt.io/v1';
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/virtualmachines/${name}`, '{"spec":{"instancetype":{"name":"'+type+'"}}}', { 'headers': headers } );
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
}
