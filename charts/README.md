<!--- app-name: kubevirt-manager -->

# Bitnami package for kubevirt-manager

The kubevirt-manager controls and manages disks, so a StorageClass is required for the solution to function properly.

Ensure the allowVolumeExpansion feature is enabled on the StorageClass you intend to use:

```yaml
allowVolumeExpansion: true
```
If you are using hostpath-provisioner or some local storage you may also need:

```yaml
volumeBindingMode: WaitForFirstConsumer
```

[Overview of kubevirt-manager](https://kubevirt-manager.io/)

Trademarks: This software listing is packaged by Bitnami. The respective trademarks mentioned in the offering are owned by the respective companies, and use of them does not imply any affiliation or endorsement.

## TL;DR

```console
helm install my-release oci://registry-1.docker.io/bitnamicharts/kubevirt-manager
```



## Introduction

Bitnami charts for Helm are carefully engineered, actively maintained and are the quickest and easiest way to deploy containers on a Kubernetes cluster that are ready to handle production workloads.

This chart bootstraps [kubevirt-manager](https://github.com/bitnami/containers/tree/main/bitnami/kubevirt-manager) on [Kubernetes](https://kubernetes.io) using the [Helm](https://helm.sh) package manager.


## Prerequisites

- Kubernetes 1.23+
- Helm 3.8.0+

## Installing the Chart

To install the chart with the release name `my-release`:

```console
helm install my-release oci://REGISTRY_NAME/REPOSITORY_NAME/kubevirt-manager
```

> Note: You need to substitute the placeholders `REGISTRY_NAME` and `REPOSITORY_NAME` with a reference to your Helm chart registry and repository. For example, in the case of Bitnami, you need to use `REGISTRY_NAME=registry-1.docker.io` and `REPOSITORY_NAME=bitnamicharts`.

The command deploys kubevirt-manager on the Kubernetes cluster in the default configuration. The [configuration](#configuration-and-installation-details) section lists the parameters that can be configured during installation.

## Configuration and installation details

### Resource requests and limits

Bitnami charts allow setting resource requests and limits for all containers inside the chart deployment. These are inside the `resources` value (check parameter table). Setting requests is essential for production workloads and these should be adapted to your specific use case.

To make this process easier, the chart contains the `resourcesPreset` values, which automatically sets the `resources` section according to different presets. Check these presets in [the bitnami/common chart](https://github.com/bitnami/charts/blob/main/bitnami/common/templates/_resources.tpl#L15). However, in production workloads using `resourcesPreset` is discouraged as it may not fully adapt to your specific needs. Find more information on container resource management in the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

### [Rolling vs Immutable tags](https://techdocs.broadcom.com/us/en/vmware-tanzu/application-catalog/tanzu-application-catalog/services/tac-doc/apps-tutorials-understand-rolling-tags-containers-index.html)

It is strongly recommended to use immutable tags in a production environment. This ensures your deployment does not change automatically if the same tag is updated with a different image.

Bitnami will release a new chart updating its containers if a new version of the main container, significant changes, or critical vulnerabilities exist.

### Backup and restore

To back up and restore Helm chart deployments on Kubernetes, you need to back up the persistent volumes from the source deployment and attach them to a new deployment using [Velero](https://velero.io/), a Kubernetes backup/restore tool. Find the instructions for using Velero in [this guide](https://techdocs.broadcom.com/us/en/vmware-tanzu/application-catalog/tanzu-application-catalog/services/tac-doc/apps-tutorials-backup-restore-deployments-velero-index.html).

### Use Sidecars and Init Containers

If additional containers are needed in the same pod (such as additional metrics or logging exporters), they can be defined using the `sidecars` config parameter.

```yaml
sidecars:
- name: your-image-name
  image: your-image
  imagePullPolicy: Always
  ports:
  - name: portname
    containerPort: 1234
```

If these sidecars export extra ports, extra port definitions can be added using the `service.extraPorts` parameter (where available), as shown in the example below:

```yaml
service:
  extraPorts:
  - name: extraPort
    port: 11311
    targetPort: 11311
```


If additional init containers are needed in the same pod, they can be defined using the `initContainers` parameter. Here is an example:

```yaml
initContainers:
  - name: your-image-name
    image: your-image
    imagePullPolicy: Always
    ports:
      - name: portname
        containerPort: 1234
```

> NOTE: This Helm chart already includes initContainers to copy a file from a read-only config volume to a writable persistent volume so the main kubevirt-manager container can use or modify it.

Learn more about [sidecar containers](https://kubernetes.io/docs/concepts/workloads/pods/) and [init containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/).

### Set Pod affinity

This chart allows you to set custom Pod affinity using the `affinity` parameter. Find more information about Pod's affinity in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).

As an alternative, use one of the preset configurations for pod affinity, pod anti-affinity, and node affinity available at the [bitnami/common](https://github.com/bitnami/charts/tree/main/bitnami/common#affinities) chart. To do so, set the `podAffinityPreset`, `podAntiAffinityPreset`, or `nodeAffinityPreset` parameters.



## Parameters

### Global parameters

| Name                                                  | Description                                                                                                                                                                                                                                                                                                                                                         | Value   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `global.imageRegistry`                                | Global Docker image registry                                                                                                                                                                                                                                                                                                                                        | `""`    |
| `global.imagePullSecrets`                             | Global Docker registry secret names as an array                                                                                                                                                                                                                                                                                                                     | `[]`    |
| `global.defaultStorageClass`                          | Global default StorageClass for Persistent Volume(s)                                                                                                                                                                                                                                                                                                                | `""`    |
| `global.security.allowInsecureImages`                 | Allows skipping image verification                                                                                                                                                                                                                                                                                                                                  | `false` |
| `global.compatibility.openshift.adaptSecurityContext` | Adapt the securityContext sections of the deployment to make them compatible with Openshift restricted-v2 SCC: remove runAsUser, runAsGroup and fsGroup and let the platform use their allowed default IDs. Possible values: auto (apply if the detected running cluster is Openshift), force (perform the adaptation always), disabled (do not perform adaptation) | `auto`  |
| `global.compatibility.omitEmptySeLinuxOptions`        | If set to true, removes the seLinuxOptions from the securityContexts when it is set to an empty object                                                                                                                                                                                                                                                              | `false` |

### Common parameters

| Name                     | Description                                                                             | Value           |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------- |
| `kubeVersion`            | Override Kubernetes version                                                             | `""`            |
| `apiVersions`            | Override Kubernetes API versions reported by .Capabilities                              | `[]`            |
| `nameOverride`           | String to partially override common.names.name                                          | `""`            |
| `fullnameOverride`       | String to fully override common.names.fullname                                          | `""`            |
| `namespaceOverride`      | String to fully override common.names.namespace                                         | `""`            |
| `commonLabels`           | Labels to add to all deployed objects                                                   | `{}`            |
| `commonAnnotations`      | Annotations to add to all deployed objects                                              | `{}`            |
| `clusterDomain`          | Kubernetes cluster domain name                                                          | `cluster.local` |
| `extraDeploy`            | Array of extra objects to deploy with the release                                       | `[]`            |
| `diagnosticMode.enabled` | Enable diagnostic mode (all probes will be disabled and the command will be overridden) | `false`         |
| `diagnosticMode.command` | Command to override all containers in the chart release                                 | `["sleep"]`     |
| `diagnosticMode.args`    | Args to override all containers in the chart release                                    | `["infinity"]`  |

### manager Parameters

| Name                                                        | Description                                                                                                                                                                                                                        | Value                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `manager.image.registry`                                    | manager image registry                                                                                                                                                                                                             | `REGISTRY_NAME`                   |
| `manager.image.repository`                                  | manager image repository                                                                                                                                                                                                           | `REPOSITORY_NAME/kubevirtmanager` |
| `manager.image.digest`                                      | manager image digest in the way sha256:aa.... Please note this parameter, if set, will override the tag image tag (immutable tags are recommended)                                                                                 | `""`                              |
| `manager.image.pullPolicy`                                  | manager image pull policy                                                                                                                                                                                                          | `IfNotPresent`                    |
| `manager.image.pullSecrets`                                 | manager image pull secrets                                                                                                                                                                                                         | `[]`                              |
| `manager.image.debug`                                       | Enable manager image debug mode                                                                                                                                                                                                    | `false`                           |
| `manager.replicaCount`                                      | Number of manager replicas to deploy                                                                                                                                                                                               | `1`                               |
| `manager.containerPorts.http`                               | manager HTTP container port                                                                                                                                                                                                        | `8080`                            |
| `manager.extraContainerPorts`                               | Optionally specify extra list of additional ports for manager containers                                                                                                                                                           | `[]`                              |
| `manager.livenessProbe.enabled`                             | Enable livenessProbe on manager containers                                                                                                                                                                                         | `false`                           |
| `manager.livenessProbe.initialDelaySeconds`                 | Initial delay seconds for livenessProbe                                                                                                                                                                                            | `90`                              |
| `manager.livenessProbe.periodSeconds`                       | Period seconds for livenessProbe                                                                                                                                                                                                   | `10`                              |
| `manager.livenessProbe.timeoutSeconds`                      | Timeout seconds for livenessProbe                                                                                                                                                                                                  | `5`                               |
| `manager.livenessProbe.failureThreshold`                    | Failure threshold for livenessProbe                                                                                                                                                                                                | `1`                               |
| `manager.livenessProbe.successThreshold`                    | Success threshold for livenessProbe                                                                                                                                                                                                | `5`                               |
| `manager.readinessProbe.enabled`                            | Enable readinessProbe on manager containers                                                                                                                                                                                        | `false`                           |
| `manager.readinessProbe.initialDelaySeconds`                | Initial delay seconds for readinessProbe                                                                                                                                                                                           | `90`                              |
| `manager.readinessProbe.periodSeconds`                      | Period seconds for readinessProbe                                                                                                                                                                                                  | `10`                              |
| `manager.readinessProbe.timeoutSeconds`                     | Timeout seconds for readinessProbe                                                                                                                                                                                                 | `5`                               |
| `manager.readinessProbe.failureThreshold`                   | Failure threshold for readinessProbe                                                                                                                                                                                               | `1`                               |
| `manager.readinessProbe.successThreshold`                   | Success threshold for readinessProbe                                                                                                                                                                                               | `5`                               |
| `manager.startupProbe.enabled`                              | Enable startupProbe on manager containers                                                                                                                                                                                          | `false`                           |
| `manager.startupProbe.initialDelaySeconds`                  | Initial delay seconds for startupProbe                                                                                                                                                                                             | `90`                              |
| `manager.startupProbe.periodSeconds`                        | Period seconds for startupProbe                                                                                                                                                                                                    | `10`                              |
| `manager.startupProbe.timeoutSeconds`                       | Timeout seconds for startupProbe                                                                                                                                                                                                   | `5`                               |
| `manager.startupProbe.failureThreshold`                     | Failure threshold for startupProbe                                                                                                                                                                                                 | `1`                               |
| `manager.startupProbe.successThreshold`                     | Success threshold for startupProbe                                                                                                                                                                                                 | `5`                               |
| `manager.customLivenessProbe`                               | Custom livenessProbe that overrides the default one                                                                                                                                                                                | `{}`                              |
| `manager.customReadinessProbe`                              | Custom readinessProbe that overrides the default one                                                                                                                                                                               | `{}`                              |
| `manager.customStartupProbe`                                | Custom startupProbe that overrides the default one                                                                                                                                                                                 | `{}`                              |
| `manager.resourcesPreset`                                   | Set manager container resources according to one common preset (allowed values: none, nano, small, medium, large, xlarge, 2xlarge). This is ignored if manager.resources is set (manager.resources is recommended for production). | `nano`                            |
| `manager.resources`                                         | Set manager container requests and limits for different resources like CPU or memory (essential for production workloads)                                                                                                          | `{}`                              |
| `manager.podSecurityContext.enabled`                        | Enable manager pods' Security Context                                                                                                                                                                                              | `true`                            |
| `manager.podSecurityContext.fsGroupChangePolicy`            | Set filesystem group change policy for manager pods                                                                                                                                                                                | `Always`                          |
| `manager.podSecurityContext.sysctls`                        | Set kernel settings using the sysctl interface for manager pods                                                                                                                                                                    | `[]`                              |
| `manager.podSecurityContext.supplementalGroups`             | Set filesystem extra groups for manager pods                                                                                                                                                                                       | `[]`                              |
| `manager.podSecurityContext.fsGroup`                        | Set fsGroup in manager pods' Security Context                                                                                                                                                                                      | `1001`                            |
| `manager.containerSecurityContext.enabled`                  | Enabled manager container' Security Context                                                                                                                                                                                        | `true`                            |
| `manager.containerSecurityContext.seLinuxOptions`           | Set SELinux options in manager container                                                                                                                                                                                           | `undefined`                       |
| `manager.containerSecurityContext.runAsUser`                | Set runAsUser in manager container' Security Context                                                                                                                                                                               | `10000`                           |
| `manager.containerSecurityContext.readOnlyRootFilesystem`   | Set readOnlyRootFilesystem in manager container' Security Context                                                                                                                                                                  | `true`                            |
| `manager.containerSecurityContext.allowPrivilegeEscalation` | Set allowPrivilegeEscalation in manager container' Security Context                                                                                                                                                                | `false`                           |
| `manager.containerSecurityContext.runAsGroup`               | Set runAsGroup in manager container' Security Context                                                                                                                                                                              | `30000`                           |
| `manager.existingConfigmap`                                 | The name of an existing ConfigMap with your custom configuration for manager                                                                                                                                                       | `nil`                             |
| `manager.command`                                           | Override default manager container command (useful when using custom images)                                                                                                                                                       | `[]`                              |
| `manager.args`                                              | Override default manager container args (useful when using custom images)                                                                                                                                                          | `[]`                              |
| `manager.automountServiceAccountToken`                      | Mount Service Account token in manager pods                                                                                                                                                                                        | `false`                           |
| `manager.hostAliases`                                       | manager pods host aliases                                                                                                                                                                                                          | `[]`                              |
| `manager.daemonsetAnnotations`                              | Annotations for manager daemonset                                                                                                                                                                                                  | `{}`                              |
| `manager.deploymentAnnotations`                             | Annotations for manager deployment                                                                                                                                                                                                 | `{}`                              |
| `manager.statefulsetAnnotations`                            | Annotations for manager statefulset                                                                                                                                                                                                | `{}`                              |
| `manager.podLabels`                                         | Extra labels for manager pods                                                                                                                                                                                                      | `{}`                              |
| `manager.podAnnotations`                                    | Annotations for manager pods                                                                                                                                                                                                       | `{}`                              |
| `manager.podAffinityPreset`                                 | Pod affinity preset. Ignored if `manager.affinity` is set. Allowed values: `soft` or `hard`                                                                                                                                        | `""`                              |
| `manager.podAntiAffinityPreset`                             | Pod anti-affinity preset. Ignored if `manager.affinity` is set. Allowed values: `soft` or `hard`                                                                                                                                   | `""`                              |
| `manager.nodeAffinityPreset.type`                           | Node affinity preset type. Ignored if `manager.affinity` is set. Allowed values: `soft` or `hard`                                                                                                                                  | `""`                              |
| `manager.nodeAffinityPreset.key`                            | Node label key to match. Ignored if `manager.affinity` is set                                                                                                                                                                      | `""`                              |
| `manager.nodeAffinityPreset.values`                         | Node label values to match. Ignored if `manager.affinity` is set                                                                                                                                                                   | `[]`                              |
| `manager.affinity`                                          | Affinity for manager pods assignment                                                                                                                                                                                               | `{}`                              |
| `manager.nodeSelector`                                      | Node labels for manager pods assignment                                                                                                                                                                                            | `{}`                              |
| `manager.tolerations`                                       | Tolerations for manager pods assignment                                                                                                                                                                                            | `[]`                              |
| `manager.updateStrategy.type`                               | manager deployment strategy type                                                                                                                                                                                                   | `Recreate`                        |
| `manager.updateStrategy.type`                               | manager statefulset strategy type                                                                                                                                                                                                  | `Recreate`                        |
| `manager.podManagementPolicy`                               | Pod management policy for manager statefulset                                                                                                                                                                                      | `OrderedReady`                    |
| `manager.priorityClassName`                                 | manager pods' priorityClassName                                                                                                                                                                                                    | `""`                              |
| `manager.topologySpreadConstraints`                         | Topology Spread Constraints for manager pod assignment spread across your cluster among failure-domains                                                                                                                            | `[]`                              |
| `manager.schedulerName`                                     | Name of the k8s scheduler (other than default) for manager pods                                                                                                                                                                    | `""`                              |
| `manager.terminationGracePeriodSeconds`                     | Seconds manager pods need to terminate gracefully                                                                                                                                                                                  | `""`                              |
| `manager.lifecycleHooks`                                    | for manager containers to automate configuration before or after startup                                                                                                                                                           | `{}`                              |
| `manager.extraEnvVars`                                      | Array with extra environment variables to add to manager containers                                                                                                                                                                | `[]`                              |
| `manager.extraEnvVarsCM`                                    | Name of existing ConfigMap containing extra env vars for manager containers                                                                                                                                                        | `""`                              |
| `manager.extraEnvVarsSecret`                                | Name of existing Secret containing extra env vars for manager containers                                                                                                                                                           | `""`                              |
| `manager.extraVolumes`                                      | Optionally specify extra list of additional volumes for the manager pods                                                                                                                                                           | `[]`                              |
| `manager.extraVolumeMounts`                                 | Optionally specify extra list of additional volumeMounts for the manager containers                                                                                                                                                | `[]`                              |
| `manager.sidecars`                                          | Add additional sidecar containers to the manager pods                                                                                                                                                                              | `[]`                              |
| `manager.initContainers`                                    | Add additional init containers to the manager pods                                                                                                                                                                                 | `[]`                              |
| `manager.pdb.create`                                        | Enable/disable a Pod Disruption Budget creation                                                                                                                                                                                    | `true`                            |
| `manager.pdb.minAvailable`                                  | Minimum number/percentage of pods that should remain scheduled                                                                                                                                                                     | `""`                              |
| `manager.pdb.maxUnavailable`                                | Maximum number/percentage of pods that may be made unavailable. Defaults to `1` if both `manager.pdb.minAvailable` and `manager.pdb.maxUnavailable` are empty.                                                                     | `""`                              |
| `manager.autoscaling.vpa.enabled`                           | Enable VPA for manager pods                                                                                                                                                                                                        | `false`                           |
| `manager.autoscaling.vpa.annotations`                       | Annotations for VPA resource                                                                                                                                                                                                       | `{}`                              |
| `manager.autoscaling.vpa.controlledResources`               | VPA List of resources that the vertical pod autoscaler can control. Defaults to cpu and memory                                                                                                                                     | `[]`                              |
| `manager.autoscaling.vpa.maxAllowed`                        | VPA Max allowed resources for the pod                                                                                                                                                                                              | `{}`                              |
| `manager.autoscaling.vpa.minAllowed`                        | VPA Min allowed resources for the pod                                                                                                                                                                                              | `{}`                              |
| `manager.autoscaling.vpa.updatePolicy.updateMode`           | Autoscaling update policy                                                                                                                                                                                                          | `Auto`                            |
| `manager.autoscaling.hpa.enabled`                           | Enable HPA for manager pods                                                                                                                                                                                                        | `false`                           |
| `manager.autoscaling.hpa.minReplicas`                       | Minimum number of replicas                                                                                                                                                                                                         | `""`                              |
| `manager.autoscaling.hpa.maxReplicas`                       | Maximum number of replicas                                                                                                                                                                                                         | `""`                              |
| `manager.autoscaling.hpa.targetCPU`                         | Target CPU utilization percentage                                                                                                                                                                                                  | `""`                              |
| `manager.autoscaling.hpa.targetMemory`                      | Target Memory utilization percentage                                                                                                                                                                                               | `""`                              |

### Traffic Exposure Parameters

| Name                                    | Description                                                                                                                      | Value                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `service.type`                          | manager service type                                                                                                             | `ClusterIP`              |
| `service.ports.http`                    | manager service HTTP port                                                                                                        | `8080`                   |
| `service.nodePorts.http`                | Node port for HTTP                                                                                                               | `""`                     |
| `service.clusterIP`                     | manager service Cluster IP                                                                                                       | `""`                     |
| `service.loadBalancerIP`                | manager service Load Balancer IP                                                                                                 | `""`                     |
| `service.loadBalancerSourceRanges`      | manager service Load Balancer sources                                                                                            | `[]`                     |
| `service.annotations`                   | Additional custom annotations for manager service                                                                                | `{}`                     |
| `service.extraPorts`                    | Extra ports to expose in manager service (normally used with the `sidecars` value)                                               | `[]`                     |
| `service.sessionAffinityConfig`         | Additional settings for the sessionAffinity                                                                                      | `{}`                     |
| `networkPolicy.enabled`                 | Specifies whether a NetworkPolicy should be created                                                                              | `true`                   |
| `networkPolicy.allowExternal`           | Don't require server label for connections                                                                                       | `true`                   |
| `networkPolicy.allowExternalEgress`     | Allow the pod to access any range of port and all destinations.                                                                  | `true`                   |
| `networkPolicy.addExternalClientAccess` | Allow access from pods with client label set to "true". Ignored if `networkPolicy.allowExternal` is true.                        | `true`                   |
| `networkPolicy.extraIngress`            | Add extra ingress rules to the NetworkPolicy                                                                                     | `[]`                     |
| `networkPolicy.extraEgress`             | Add extra ingress rules to the NetworkPolicy (ignored if allowExternalEgress=true)                                               | `[]`                     |
| `networkPolicy.ingressPodMatchLabels`   | Labels to match to allow traffic from other pods. Ignored if `networkPolicy.allowExternal` is true.                              | `{}`                     |
| `networkPolicy.ingressNSMatchLabels`    | Labels to match to allow traffic from other namespaces. Ignored if `networkPolicy.allowExternal` is true.                        | `{}`                     |
| `networkPolicy.ingressNSPodMatchLabels` | Pod labels to match to allow traffic from other namespaces. Ignored if `networkPolicy.allowExternal` is true.                    | `{}`                     |
| `ingress.enabled`                       | Enable ingress record generation for manager                                                                                     | `false`                  |
| `ingress.pathType`                      | Ingress path type                                                                                                                | `ImplementationSpecific` |
| `ingress.apiVersion`                    | Force Ingress API version (automatically detected if not set)                                                                    | `""`                     |
| `ingress.hostname`                      | Default host for the ingress record                                                                                              | `manager.local`          |
| `ingress.ingressClassName`              | IngressClass that will be be used to implement the Ingress (Kubernetes 1.18+)                                                    | `""`                     |
| `ingress.path`                          | Default path for the ingress record                                                                                              | `/`                      |
| `ingress.annotations`                   | Additional annotations for the Ingress resource. To enable certificate autogeneration, place here your cert-manager annotations. | `{}`                     |
| `ingress.tls`                           | Enable TLS configuration for the host defined at `ingress.hostname` parameter                                                    | `false`                  |
| `ingress.selfSigned`                    | Create a TLS secret for this ingress record using self-signed certificates generated by Helm                                     | `false`                  |
| `ingress.extraHosts`                    | An array with additional hostname(s) to be covered with the ingress record                                                       | `[]`                     |
| `ingress.extraPaths`                    | An array with additional arbitrary paths that may need to be added to the ingress under the main host                            | `[]`                     |
| `ingress.extraTls`                      | TLS configuration for additional hostname(s) to be covered with this ingress record                                              | `[]`                     |
| `ingress.secrets`                       | Custom TLS certificates as secrets                                                                                               | `[]`                     |
| `ingress.extraRules`                    | Additional rules to be covered with this ingress record                                                                          | `[]`                     |

### Persistence Parameters

| Name                        | Description                                                                                             | Value               |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| `persistence.enabled`       | Enable persistence using Persistent Volume Claims                                                       | `true`              |
| `persistence.mountPath`     | Path to mount the volume at.                                                                            | `/var/cache/nginx`  |
| `persistence.subPath`       | The subdirectory of the volume to mount to, useful in dev environments and one PV for multiple services | `""`                |
| `persistence.storageClass`  | Storage class of backing PVC                                                                            | `""`                |
| `persistence.annotations`   | Persistent Volume Claim annotations                                                                     | `{}`                |
| `persistence.accessModes`   | Persistent Volume Access Modes                                                                          | `["ReadWriteOnce"]` |
| `persistence.size`          | Size of data volume                                                                                     | `8Gi`               |
| `persistence.existingClaim` | The name of an existing PVC to use for persistence                                                      | `""`                |
| `persistence.selector`      | Selector to match an existing Persistent Volume for WordPress data PVC                                  | `{}`                |
| `persistence.dataSource`    | Custom PVC data source                                                                                  | `{}`                |

### Init Container Parameters

| Name                                                        | Description                                                                                                                                                                                                                                         | Value                      |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `volumePermissions.enabled`                                 | Enable init container that changes the owner/group of the PV mount point to `runAsUser:fsGroup`                                                                                                                                                     | `false`                    |
| `volumePermissions.image.registry`                          | OS Shell + Utility image registry                                                                                                                                                                                                                   | `REGISTRY_NAME`            |
| `volumePermissions.image.repository`                        | OS Shell + Utility image repository                                                                                                                                                                                                                 | `REPOSITORY_NAME/os-shell` |
| `volumePermissions.image.pullPolicy`                        | OS Shell + Utility image pull policy                                                                                                                                                                                                                | `IfNotPresent`             |
| `volumePermissions.image.pullSecrets`                       | OS Shell + Utility image pull secrets                                                                                                                                                                                                               | `[]`                       |
| `volumePermissions.resourcesPreset`                         | Set init container resources according to one common preset (allowed values: none, nano, small, medium, large, xlarge, 2xlarge). This is ignored if volumePermissions.resources is set (volumePermissions.resources is recommended for production). | `nano`                     |
| `volumePermissions.resources`                               | Set init container requests and limits for different resources like CPU or memory (essential for production workloads)                                                                                                                              | `{}`                       |
| `volumePermissions.containerSecurityContext.enabled`        | Enabled init container' Security Context                                                                                                                                                                                                            | `true`                     |
| `volumePermissions.containerSecurityContext.seLinuxOptions` | Set SELinux options in init container                                                                                                                                                                                                               | `{}`                       |
| `volumePermissions.containerSecurityContext.runAsUser`      | Set init container's Security Context runAsUser                                                                                                                                                                                                     | `0`                        |

### Other Parameters

| Name                                          | Description                                                                                            | Value                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `rbac.role.create`                            | Specifies whether a Role should be created                                                             | `false`                                                      |
| `rbac.role.rules`                             | Custom RBAC rules to set                                                                               | `""`                                                         |
| `rbac.clusterrole1.create`                    | Specifies whether a ClusterRole1 should be created                                                     | `true`                                                       |
| `rbac.clusterrole1.rules`                     | Custom RBAC rules to set                                                                               | `[]`                                                         |
| `rbac.clusterrole2.create`                    | Specifies whether a ClusterRole2 should be created                                                     | `true`                                                       |
| `rbac.clusterrole2.rules`                     | Custom RBAC rules to set                                                                               | `[]`                                                         |
| `rbac.clusterrole3.create`                    | Specifies whether a ClusterRole3 should be created                                                     | `true`                                                       |
| `rbac.clusterrole3.rules`                     | Custom RBAC rules to set                                                                               | `[]`                                                         |
| `rbac.clusterrole4.create`                    | Specifies whether a ClusterRole4 should be created                                                     | `true`                                                       |
| `rbac.clusterrole4.rules`                     | Custom RBAC rules to set                                                                               | `[]`                                                         |
| `priorityClass1.enabled`                      | Enable a PriorityClass1 to control the scheduling priority of operator pods                            | `true`                                                       |
| `priorityClass1.name`                         | The name of the PriorityClass1 to use                                                                  | `vm-standard`                                                |
| `priorityClass1.value`                        | The value of the PriorityClass1 to use                                                                 | `999999999`                                                  |
| `priorityClass1.description`                  | The description of the PriorityClass1 to use                                                           | `Priority class for VMs which should not be preemtited.`     |
| `priorityClass1.preemptionPolicy`             | controls the preemption behavior for the pod.                                                          | `Never`                                                      |
| `priorityClass2.enabled`                      | Enable a PriorityClass2 to control the scheduling priority of operator pods                            | `true`                                                       |
| `priorityClass2.name`                         | The name of the PriorityClass2 to use                                                                  | `vm-preemptible`                                             |
| `priorityClass2.value`                        | The value of the PriorityClass2 to use                                                                 | `1000000`                                                    |
| `priorityClass2.description`                  | The description of the PriorityClass2 to use                                                           | `Priority class for VMs which are allowed to be preemtited.` |
| `priorityClass2.preemptionPolicy`             | controls the preemption behavior for the pod.                                                          | `PreemptLowerPriority`                                       |
| `serviceAccount.create`                       | Specifies whether a ServiceAccount should be created                                                   | `true`                                                       |
| `serviceAccount.name`                         | The name of the ServiceAccount to use.                                                                 | `kubevirt-manager`                                           |
| `serviceAccount.annotations`                  | Additional Service Account annotations (evaluated as a template)                                       | `{}`                                                         |
| `serviceAccount.automountServiceAccountToken` | Automount service account token for the server service account                                         | `""`                                                         |
| `metrics.enabled`                             | Enable the export of Prometheus metrics                                                                | `false`                                                      |
| `metrics.serviceMonitor.enabled`              | if `true`, creates a Prometheus Operator ServiceMonitor (also requires `metrics.enabled` to be `true`) | `false`                                                      |
| `metrics.serviceMonitor.namespace`            | Namespace in which Prometheus is running                                                               | `""`                                                         |
| `metrics.serviceMonitor.annotations`          | Additional custom annotations for the ServiceMonitor                                                   | `{}`                                                         |
| `metrics.serviceMonitor.labels`               | Extra labels for the ServiceMonitor                                                                    | `{}`                                                         |
| `metrics.serviceMonitor.jobLabel`             | The name of the label on the target service to use as the job name in Prometheus                       | `""`                                                         |
| `metrics.serviceMonitor.honorLabels`          | honorLabels chooses the metric's labels on collisions with target labels                               | `false`                                                      |
| `metrics.serviceMonitor.interval`             | Interval at which metrics should be scraped.                                                           | `""`                                                         |
| `metrics.serviceMonitor.scrapeTimeout`        | Timeout after which the scrape is ended                                                                | `""`                                                         |
| `metrics.serviceMonitor.metricRelabelings`    | Specify additional relabeling of metrics                                                               | `[]`                                                         |
| `metrics.serviceMonitor.relabelings`          | Specify general relabeling                                                                             | `[]`                                                         |
| `metrics.serviceMonitor.selector`             | Prometheus instance selector labels                                                                    | `{}`                                                         |

...

> Note: You need to substitute the placeholders `REGISTRY_NAME` and `REPOSITORY_NAME` with a reference to your Helm chart registry and repository. For example, in the case of Bitnami, you need to use `REGISTRY_NAME=registry-1.docker.io` and `REPOSITORY_NAME=bitnamicharts`.

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```console
helm install my-release -f values.yaml oci://REGISTRY_NAME/REPOSITORY_NAME/kubevirt-manager
```

> Note: You need to substitute the placeholders `REGISTRY_NAME` and `REPOSITORY_NAME` with a reference to your Helm chart registry and repository. For example, in the case of Bitnami, you need to use `REGISTRY_NAME=registry-1.docker.io` and `REPOSITORY_NAME=bitnamicharts`.
> **Tip**: You can use the default [values.yaml](https://github.com/bitnami/charts/tree/main/bitnami/kubevirt-manager/values.yaml)

## License

Copyright &copy; 2025 Broadcom. The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

