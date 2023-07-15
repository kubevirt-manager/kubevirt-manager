import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    deleteKubevirtMachineTemplate(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/infrastructure.cluster.x-k8s.io/v1alpha1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/kubevirtmachinetemplates/${name}`);
    }

    deleteKubeadmConfigTemplate(namespace: string, name: string): Observable<any> {
        var baseUrl = "./k8s/apis/bootstrap.cluster.x-k8s.io/v1beta1"
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/kubeadmconfigtemplates/${name}`);
    }

    createCluster(namespace: string, name: string, clustervalue: Object): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/clusters/${name}`, clustervalue, { 'headers': headers } );
    }

    createKubevirtCluster(namespace: string, clustervalue: Object): Observable<any> {
        var baseUrl = "./k8s/apis/infrastructure.cluster.x-k8s.io/v1alpha1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubevirtclusters`, clustervalue, { 'headers': headers } );
    }

    createKubeadmControlPlane(namespace: string, cpvalue: Object): Observable<any> {
        var baseUrl = "./k8s/apis/controlplane.cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes`, cpvalue, { 'headers': headers } );
    }

    rolloutKubeadmControlPlane(namespace: string, name: string, ts: string): Observable<any> {
        var baseUrl = "./k8s/apis/controlplane.cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/merge-patch+json',
            'accept': 'application/json'
        };
        return this.http.patch(`${baseUrl}/namespaces/${namespace}/kubeadmcontrolplanes/${name}`, ' {"spec":{"rolloutAfter":"' + ts + '"}}', { 'headers': headers } );
    }

    createKubeadmConfigTemplate(namespace: string, ctvalue: Object): Observable<any> {
        var baseUrl = "./k8s/apis/bootstrap.cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubeadmconfigtemplates`, ctvalue, { 'headers': headers } );
    }

    createKubevirtMachineTemplate(namespace: string, template: Object): Observable<any> {
        var baseUrl = "./k8s/apis/infrastructure.cluster.x-k8s.io/v1alpha1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/kubevirtmachinetemplates`, template, { 'headers': headers } );
    }

    createMachineDeployment(namespace: string, mdvalue: Object): Observable<any> {
        var baseUrl = "./k8s/apis/cluster.x-k8s.io/v1beta1"
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/machinedeployments`, mdvalue, { 'headers': headers } );
    }

    createConfigSecret(namespace: string, cvalue: Object): Observable<any> {
        let baseUrl = './k8s/api/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/secrets`, cvalue, { 'headers': headers } );
    }

    getConfigSecret(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.get(`${baseUrl}/namespaces/${namespace}/secrets/${name}`);
    }

    deleteConfigSecret(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/secrets/${name}`);
    }

    createClusterResourseSet(namespace: string, crsvalue: Object): Observable<any> {
        let baseUrl = './k8s/apis/addons.cluster.x-k8s.io/v1alpha3'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/clusterresourcesets`, crsvalue, { 'headers': headers } );
    }

    deleteClusterResourseSet(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/addons.cluster.x-k8s.io/v1alpha3'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/clusterresourcesets/${name}`);
    }

    createKCCServiceAccount(namespace: string, saalue: Object): Observable<any> {
        let baseUrl = './k8s/api/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/serviceaccounts`, saalue, { 'headers': headers } );
    }

    createKCCRoleBinding(namespace: string, rbvalue: Object): Observable<any> {
        let baseUrl = './k8s/apis/rbac.authorization.k8s.io/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/rolebindings`, rbvalue, { 'headers': headers } );
    }

    createKCCConfigMap(namespace: string, cmvalue: Object): Observable<any> {
        let baseUrl = './k8s/api/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/configmaps`, cmvalue, { 'headers': headers } );
    }

    deleteKCCConfigMap(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/configmaps/${name}`);
    }

    createKCCController(namespace: string, kccvalue: Object): Observable<any> {
        let baseUrl = './k8s/apis/apps/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/deployments`, kccvalue, { 'headers': headers } );
    }

    getKCCServices(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/api/v1';
        return this.http.get(`${baseUrl}/namespaces/${namespace}/services?labelSelector=cluster.x-k8s.io%2Fcluster-name%3D${name}%2Ccluster.x-k8s.io%2Ftenant-service-name`);
    }

    deleteKCCServices(namespace: string, name: string): Observable<any> {
        var baseUrl ='./k8s/api/v1';
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/services/${name}`);
    }

    createCSIController(namespace: string, kccvalue: Object): Observable<any> {
        let baseUrl = './k8s/apis/apps/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/deployments`, kccvalue, { 'headers': headers } );
    }

    createCSIServiceAccount(namespace: string, saalue: Object): Observable<any> {
        let baseUrl = './k8s/api/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/serviceaccounts`, saalue, { 'headers': headers } );
    }

    createCSIRoleBinding(namespace: string, rbvalue: Object): Observable<any> {
        let baseUrl = './k8s/apis/rbac.authorization.k8s.io/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/rolebindings`, rbvalue, { 'headers': headers } );
    }

    createCSIConfigMap(namespace: string, cmvalue: Object): Observable<any> {
        let baseUrl = './k8s/api/v1'
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        };
        return this.http.post(`${baseUrl}/namespaces/${namespace}/configmaps`, cmvalue, { 'headers': headers } );
    }

    deleteCSIController(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/apps/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/deployments/${name}`);
    }

    deleteCSIServiceAccount(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/serviceaccounts/${name}`);
    }

    deleteCSIRoleBinding(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/apis/rbac.authorization.k8s.io/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/rolebindings/${name}`);
    }

    deleteCSIConfigMap(namespace: string, name: string): Observable<any> {
        let baseUrl = './k8s/api/v1'
        return this.http.delete(`${baseUrl}/namespaces/${namespace}/configmaps/${name}`);
    }
}
