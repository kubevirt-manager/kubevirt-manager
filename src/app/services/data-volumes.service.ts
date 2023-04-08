import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataVolume } from '../templates/data-volume.apitemplate';

@Injectable({
  providedIn: 'root'
})
export class DataVolumesService {

    blankDiskTemplate = new DataVolume().blankDisk;
    httpDiskTemplate = new DataVolume().httpDisk;
    s3DiskTemplate = new DataVolume().s3Disk;
    gcsDiskTemplate = new DataVolume().gcsDisk;
    registryDiskTemplate = new DataVolume().registryDisk;
    pvcDiskTemplate = new DataVolume().pvcDisk;
    
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

    createBlankDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string): Observable<any> {
        let thisDv = this.blankDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createHTTPDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string, dvUrl: string): Observable<any> {
        let thisDv = this.httpDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        thisDv.spec.source.http["url"] = dvUrl;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createS3DataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string, dvUrl: string): Observable<any> {
        let thisDv = this.s3DiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        thisDv.spec.source.s3["url"] = dvUrl;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createGCSDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string, dvUrl: string): Observable<any> {
        let thisDv = this.gcsDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        thisDv.spec.source.gcs["url"] = dvUrl;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createRegistryDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string, dvUrl: string): Observable<any> {
        let thisDv = this.registryDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        thisDv.spec.source.registry["url"] = dvUrl;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }

    createPVCDataVolume(dvNamespace: string, dvName: string, dvSize: string, dvSc: string, dvAm: string, fromName: string): Observable<any> {
        let thisDv = this.pvcDiskTemplate;
        thisDv.metadata["name"] = dvName;
        thisDv.metadata["namespace"] = dvNamespace;
        thisDv.spec.pvc.resources.requests["storage"] = dvSize + "Gi";
        thisDv.spec.pvc["storageClassName"] = dvSc;
        thisDv.spec.pvc.accessModes[0] = dvAm;
        thisDv.spec.source.pvc["name"] = fromName;
        thisDv.spec.source.pvc["namespace"] = dvNamespace;
        var baseUrl ='./k8s/apis/cdi.kubevirt.io/v1beta1';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${dvNamespace}/datavolumes/${dvName}`, thisDv, { 'headers': headers } );
    }
}
