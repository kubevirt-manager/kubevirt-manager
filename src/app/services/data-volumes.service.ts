import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataVolume } from '../interfaces/data-volume';

@Injectable({
  providedIn: 'root'
})
export class DataVolumesService {
    
    constructor(private http: HttpClient) { }

    getDataVolumes(): Observable<any> {
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/datavolumes`);
    }

    getNamespacedDataVolumes(dvNamespace: string): Observable<any> {
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/namespaces/${dvNamespace}/datavolumes`);
    }

    getDataVolumeInfo(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`);
    }

    deleteDataVolume(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`);
    }

    createDataVolume(dataVolume: DataVolume): Observable<any> {
        var apiVersion = dataVolume.apiVersion;
        var name = dataVolume.metadata.name;
        var namespace = dataVolume.metadata.namespace;
        var baseUrl ='./k8s/apis/' + apiVersion;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`, dataVolume, { 'headers': headers } );
    }
}
