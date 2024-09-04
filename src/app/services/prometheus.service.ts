import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrometheusService {

    constructor(private http: HttpClient) { }

    /*
     * Check if Prometheus is Enabled
     */
    checkPrometheus(): Observable<any> {
        var metric = "kubevirt_info";
        var baseUrl ='./api/v1/query?query';
        var promQuery = metric;
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get Storage Writes
     */
    getStorageWrite(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_write_traffic_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Get Storage Reads
     */
    getStorageRead(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_read_traffic_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get Network Sent Data
     */
    getNetSent(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_transmit_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Get Network Received Data
     */
    getNetRecv(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_receive_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + ")or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get CPU Summary
     */
    getCpuSummary(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kube_pod_container_resource_requests";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{container=\"compute\",resource=\"cpu\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get Mem Summary
     */
    getMemSummary(start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_memory_domain_bytes";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "/1024000)or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }


    /*
     * Get VM Storage Writes
     */
    getVMStorageWrite(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_write_traffic_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{name=\"" + name + "\",namespace=\"" + namespace + "\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Get Storage Reads
     */
    getVMStorageRead(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_storage_read_traffic_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{name=\"" + name + "\",namespace=\"" + namespace + "\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get Network Sent Data
     */
    getVMNetSent(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_transmit_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{name=\"" + name + "\",namespace=\"" + namespace + "\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }
    
    /*
     * Get Network Received Data
     */
    getVMNetRecv(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_network_receive_bytes_total";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{name=\"" + name + "\",namespace=\"" + namespace + "\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get CPU Summary
     */
    getVMCpuSummary(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kube_pod_container_resource_requests";
        var podName = "virt-launcher-" + name + ".*"
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{container=\"compute\",resource=\"cpu\",namespace=\"" + namespace + "\",pod=~\"" + podName + "\"})or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

    /*
     * Get Mem Summary
     */
    getVMMemSummary(name: string, namespace: string, start: Number, end: Number, step: Number): Observable<any> {
        var metric = "kubevirt_vmi_memory_domain_bytes";
        var baseUrl ='./api/v1/query_range?query';
        var promQuery = "sum(" + metric + "{name=\"" + name + "\",namespace=\"" + namespace + "\"}/1024000)or%20vector(0)&start=" + start.toString() + "&end=" + end.toString() + "&step=" + step.toString();
        return this.http.get(`${baseUrl}=${promQuery}`);
    }

}
