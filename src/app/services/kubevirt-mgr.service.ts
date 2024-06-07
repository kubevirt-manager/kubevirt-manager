import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class KubevirtMgrService {

    constructor(private http: HttpClient) { }

    createImage(image: Image): Observable<any> {
        let baseUrl = './k8s/apis/' + image.apiVersion;
        let namespace = image.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/images`, image, { 'headers': headers } );
    }

    deleteImage(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt-manager.io/v1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/images/${name}`);
    }

    getImage(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt-manager.io/v1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/images/${name}`);
    }

    getImages(): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt-manager.io/v1';
        return this.http.get(`${baseUrl}/images`);
    }

    getNamespacedImages(namespace: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt-manager.io/v1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/images`);
    }

    editImage(image: Image): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt-manager.io/v1';
        let name = image.metadata.name;
        let namespace = image.metadata.namespace;
        let spec = { spec: image.spec };
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/images/${name}`, spec, { 'headers': headers } );
    }
}
