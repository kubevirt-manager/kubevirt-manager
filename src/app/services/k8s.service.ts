import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Services } from '../interfaces/services';
import { Secret } from '../interfaces/secret';
import { ConfigMap } from '../interfaces/config-map';
import { ServiceAccount } from '../interfaces/service-account';

const baseUrl ='./k8s/api/v1'

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

    getNamespacedPersistentVolumeClaims(namespace: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims`);
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
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/persistentvolumeclaims/${name}`, '{"spec":{"resources":{"requests":{"storage":" '+size+'"}}}}', { 'headers': headers } );
    }

    createService(service: Services): Observable<any> {
        let namespace = service.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/services`, service, { 'headers': headers } );
    }

    getServices(): Observable<any> {
        return this.http.get(`${baseUrl}/services?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getServicesNamespaced(namespace: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getService(namespace: string, name: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services/${name}`);
    }

    deleteService(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/services/${name}`);
    }

    changeServiceType(namespace: string, name: string, type: string): Observable<any> {
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/services/${name}`, '{"spec":{"type":"'+type+'"}}', { 'headers': headers } );
    }

    createSecret(secret: Secret): Observable<any> {
        let namespace = secret.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/secrets`, secret, { 'headers': headers } );
    }

    getSecret(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/secrets/${name}`);
    }

    deleteSecret(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/secrets/${name}`);
    }

    getSSHSecrets(): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/secrets?labelSelector=kubevirt-manager.io/managed%3Dtrue,kubevirt-manager.io/ssh%3Dtrue`);
    }

    getSSHSecretsNamespaced(namespace: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/secrets?labelSelector=kubevirt-manager.io/managed%3Dtrue,kubevirt-manager.io/ssh%3Dtrue`);
    }

    createConfigMap(configMap: ConfigMap): Observable<any> {
        let namespace = configMap.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/configmaps`, configMap, { 'headers': headers } );
    }

    getConfigMap(namespace: string, name: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/configmaps/${name}`);
    }

    deleteConfigMap(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/configmaps/${name}`);
    }

    createServiceAccount(serviceAccount: ServiceAccount): Observable<any> {
        let namespace = serviceAccount.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/serviceaccounts`, serviceAccount, { 'headers': headers } );
    }

    getServiceAccount(namespace: string, name: string): Observable<any> {
        return this.http.get(`${baseUrl}/namespaces/${namespace}/serviceaccounts/${name}`);
    }

    deleteServiceAccount(namespace: string, name: string): Observable<any> {
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/serviceaccounts/${name}`);
    }

    getNetworkPolicies(): Observable<any> {
        let baseUrl = './k8s/apis/networking.k8s.io/v1'
        return this.http.get(`${baseUrl}/networkpolicies?labelSelector=kubevirt-manager.io/managed%3Dtrue`);
    }

}
