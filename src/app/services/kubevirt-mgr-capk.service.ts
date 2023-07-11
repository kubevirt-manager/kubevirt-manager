import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class KubevirtMgrCapk {
    constructor(private http: HttpClient) { }

    loadImages(): Observable<any> {
        let baseUrl = 'https://kubevirt-manager.online'
        return this.http.get(`${baseUrl}/capk-versions.json`, {responseType: 'json'});
    }

    loadCNIs(): Observable<any> {
        let baseUrl = 'https://kubevirt-manager.online'
        return this.http.get(`${baseUrl}/cni-versions.json`, {responseType: 'json'});
    }

    loadFeatures(): Observable<any> {
        let baseUrl = 'https://kubevirt-manager.online'
        return this.http.get(`${baseUrl}/features.json`, {responseType: 'json'});
    }

    loadFile(url: string): Observable<any> {
        return this.http.get(url, {responseType: 'text'});
    }
}
