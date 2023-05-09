import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl ='./k8s/apis'

@Injectable({
  providedIn: 'root'
})
export class K8sApisService {

    constructor(private http: HttpClient) { }

    getCrds(): Observable<any> {
        return this.http.get(`${baseUrl}/apiextensions.k8s.io/v1/customresourcedefinitions`);
    }

    getNetworkAttachs(): Observable<any> {
        return this.http.get(`${baseUrl}/k8s.cni.cncf.io/v1/network-attachment-definitions`);
    }

    getStorageClasses(): Observable<any> {
        return this.http.get(`${baseUrl}/storage.k8s.io/v1/storageclasses`);
    }

    getPriorityClasses(): Observable<any> {
        return this.http.get(`${baseUrl}/scheduling.k8s.io/v1/priorityclasses?labelSelector=kubevirt-manager.io/managed%3Dtrue`);
    }

    getHpas(): Observable<any> {
        return this.http.get(`${baseUrl}/autoscaling/v2/horizontalpodautoscalers?labelSelector=kubevirt-manager.io/managed%3Dtrue`);
    }

    getNamespacedHpas(namespace: string): Observable<any> {
        return this.http.get(`${baseUrl}/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers?labelSelector=kubevirt-manager.io/managed%3Dtrue`);
    }

    createHpa(namespace: string, hpaspec: Object): Observable<any> {
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers`, hpaspec, { 'headers': headers } );
    }

    deleteHPA(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers/${name}`);
    }

    patchHpa(namespace: string, name: string, min: number, max: number, avg: number): Observable<any> {
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers/${name}`, '{"spec":{"maxReplicas":'+max+',"metrics":[{"resource":{"name":"cpu","target":{"averageUtilization":'+avg+',"type":"Utilization"}},"type":"Resource"}],"minReplicas":'+min+'}}', { 'headers': headers } );
    }
}
