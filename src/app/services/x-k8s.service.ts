import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cluster } from '../interfaces/cluster';
import { KubevirtCluster } from '../interfaces/kubevirt-cluster';
import { KubeadmControlPlane } from '../interfaces/kubeadm-control-plane';
import { KubevirtMachineTemplate } from '../interfaces/kubevirt-machine-template';
import { KubeadmConfigTemplate } from '../interfaces/kubeadm-config-template';
import { MachineDeployment } from '../interfaces/machine-deployment';
import { ClusterResourceSet } from '../interfaces/cluster-resource-set';
import { MachineHealthCheck } from '../interfaces/machine-health-check';

@Injectable({
  providedIn: 'root'
})
export class XK8sService {
    constructor(private http: HttpClient) { }

    getClusters(): Observable<any> {
        let baseUrl = './k8s/apis/cluster.x-k8s.io/v1beta1'
        return this.http.get(`${baseUrl}/clusters`);
    }

    getCluster(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/cluster.x-k8s.io/v1beta1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/clusters/${name}`);
    }

    deleteCluster(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/cluster.x-k8s.io/v1beta1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/clusters/${name}`);
    }

    getClustersNamespaced(namespace: string): Observable<any> {
        let baseUrl = './k8s/apis/cluster.x-k8s.io/v1beta1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/clusters?labelSelector=kubevirt-manager.io%2Fmanaged`);
    }

    getClusterControlPlane(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/controlplane.cluster.x-k8s.io/v1beta1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes/${name}`);
    }

    getClusterControlPlaneNodes(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt.io/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt.io/domain%3D${name}%2Ccluster.x-k8s.io/role=control-plane`);
    }

    getClusterMachineDeployments(namespace: string, name: string): Observable<any> {
        let baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        return this.http.get(`${baseUrl}/namespaces/${namespace}/machinedeployments?labelSelector=cluster.x-k8s.io/cluster-name%3D${name}`);
    }

    getClusterMachineDeploymentNodes(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt.io/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt.io/domain%3D${name}%2Ccluster.x-k8s.io/role=worker`);
    }

    getClusterKubeconfig(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/secrets/${name}-kubeconfig`);
    }

    getClusterSSHKey(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/secrets/${name}-ssh-keys`);
    }

    getKubevirtMachineTemplate(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/infrastructure.cluster.x-k8s.io/v1alpha1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/kubevirtmachinetemplates/${name}`);
    }

    scaleKubeadmControlPlane(namespace: string, name: string, size: string): Observable<any> {
        var baseUrl = "./k8s/apis/controlplane.cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes/${name}`, '{"spec":{"replicas": ' + size + '}}', { 'headers': headers } );
    }

    updatePoolAutoscaling(namespace: string, name: string, min: string, max: string): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/machinedeployments/${name}`, '{"metadata":{"annotations":{"cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size":"' + max + '","cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size":"' + min + '"}}}', { 'headers': headers } );
    }

    scaleMachineDeployment(namespace: string, name: string, size: string): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/machinedeployments/${name}`, '{"spec":{"replicas": ' + size + '}}', { 'headers': headers } );
    }

    deleteMachineDeployment(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/machinedeployments/${name}`);
    }

    deleteMachineHealthCheck(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/machinehealthchecks/${name}`);
    }

    deleteKubevirtMachineTemplate(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/infrastructure.cluster.x-k8s.io/v1alpha1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/kubevirtmachinetemplates/${name}`);
    }

    deleteKubeadmConfigTemplate(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/bootstrap.cluster.x-k8s.io/v1beta1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/kubeadmconfigtemplates/${name}`);
    }

    createCluster(cluster: Cluster): Observable<any> {
        var baseUrl = "./k8s/apis/" + cluster.apiVersion;
        var namespace = cluster.metadata.namespace;
        var name = cluster.metadata.name;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/clusters/${name}`, cluster, { 'headers': headers } );
    }

    createKubevirtCluster(kubevirtCluster: KubevirtCluster): Observable<any> {
        var baseUrl = "./k8s/apis/" + kubevirtCluster.apiVersion;
        var namespace = kubevirtCluster.metadata.namespace;
        var name = kubevirtCluster.metadata.name;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubevirtclusters`, kubevirtCluster, { 'headers': headers } );
    }

    createKubeadmControlPlane(kubeadmControlPlane: KubeadmControlPlane): Observable<any> {
        var baseUrl = "./k8s/apis/" + kubeadmControlPlane.apiVersion;
        var namespace = kubeadmControlPlane.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes`, kubeadmControlPlane, { 'headers': headers } );
    }

    rolloutKubeadmControlPlane(namespace: string, name: string, ts: string): Observable<any> {
        var baseUrl = "./k8s/apis/controlplane.cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes/${name}`, ' {"spec":{"rolloutAfter":"' + ts + '"}}', { 'headers': headers } );
    }

    createKubeadmConfigTemplate(kubeadmConfigTemplate: KubeadmConfigTemplate): Observable<any> {
        var baseUrl = "./k8s/apis/" + kubeadmConfigTemplate.apiVersion;
        var namespace = kubeadmConfigTemplate.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubeadmconfigtemplates`, kubeadmConfigTemplate, { 'headers': headers } );
    }

    createKubevirtMachineTemplate(kubevirtMachineTemplate: KubevirtMachineTemplate): Observable<any> {
        var baseUrl = "./k8s/apis/" + kubevirtMachineTemplate.apiVersion;
        var namespace = kubevirtMachineTemplate.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubevirtmachinetemplates`, kubevirtMachineTemplate, { 'headers': headers } );
    }

    createMachineDeployment(machineDeployment: MachineDeployment): Observable<any> {
        var baseUrl = "./k8s/apis/" + machineDeployment.apiVersion;
        var namespace = machineDeployment.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/machinedeployments`, machineDeployment, { 'headers': headers } );
    }

    getMachineDeployment(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1";
        return this.http.get(`${baseUrl}/namespaces/${namespace}/machinedeployments/${name}`);
    }

    getMachineDeploymentNodes(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/kubevirt.io/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt.io/domain%3D${name}%2Ccluster.x-k8s.io/role=worker`);
    }

    createMachineHealthCheck(machineHealthCheck: MachineHealthCheck): Observable<any> {
        var baseUrl = "./k8s/apis/" + machineHealthCheck.apiVersion;
        var namespace = machineHealthCheck.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/machinedhealthchecks`, machineHealthCheck, { 'headers': headers } );
    }

    createClusterResourseSet(clusterResourceSet: ClusterResourceSet): Observable<any> {
        let baseUrl = './k8s/apis/' + clusterResourceSet.apiVersion;
        let namespace = clusterResourceSet.metadata.namespace;
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/clusterresourcesets`, clusterResourceSet, { 'headers': headers } );
    }

    deleteClusterResourseSet(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/addons.cluster.x-k8s.io/v1beta1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/clusterresourcesets/${name}`);
    }

    getKCCServices(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/api/v1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services?labelSelector=cluster.x-k8s.io%2Fcluster-name%3D${name}%2Ccluster.x-k8s.io%2Ftenant-service-name`);
    }

}
