import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrometheusService {

    constructor(private http: HttpClient) { }

    /*
     * Generate timestamps for Prometheus Query
     */
    getStorageWrite(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_write_traffic_bytes_total";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Generate timestamps for Prometheus Query
     */
    getStorageRead(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_read_traffic_bytes_total";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Generate timestamps for Prometheus Query
     */
    getNetSent(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_transmit_bytes_total";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Generate timestamps for Prometheus Query
     */
    getNetRecv(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_receive_bytes_total";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Generate timestamps for Prometheus Query
     */
    getCpuSummary(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kube_pod_container_resource_requests";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{container=\"compute\",resource=\"cpu\"})&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Generate timestamps for Prometheus Query
     */
    getMemSummary(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_memory_domain_bytes_total";
        var baseUrl ='http://172.16.145.3:9091/api/v1/query_range?query';
        var promQuery = "sum(" + metric + "/1024000)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

}
