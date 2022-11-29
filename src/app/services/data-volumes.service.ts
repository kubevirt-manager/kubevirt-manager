import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataVolume } from '../templates/data-volume.apitemplate';

@Injectable({
  providedIn: 'root'
})
export class DataVolumesService {

    blankDiskTemplate = new DataVolume().blankDisk;
    urlDiskTemplate = new DataVolume().urlDisk;
    pvcDiskTemplate = new DataVolume().pvcDisk;
    
    constructor(private http: HttpClient) { }

    getDataVolumes(): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/datavolumes`);
    }

    getNamespacedDataVolumes(dvNamespace: string): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/namespaces/${dvNamespace}/datavolumes`);
    }

    getDataVolumeInfo(namespace: string, name: string): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`);
    }

    deleteDataVolume(namespace: string, name: string): Observable<any> {
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/datavolumes/${name}`);
    }

    createBlankDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string): Observable<any> {
        let thisDv = this.blankDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createURLDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvUrl: string): Observable<any> {
        let thisDv = this.urlDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.source.http["url"] = dvUrl;
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createPVCDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, fromName: string): Observable<any> {
        let thisDv = this.pvcDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.source.pvc["name"] = fromName;
        thisDv.spec.source.pvc["namespace"] = dvNamespace;
        var baseUrl ='/k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }
}
