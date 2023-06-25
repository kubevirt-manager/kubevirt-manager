export class KClusterTemplate {

    Cluster = {
        "apiVersion": "cluster.x-k8s.io/v1beta1",
        "kind": "Cluster",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "clusterNetwork": {
            "pods": {
              "cidrBlocks": [""]
            },
            "services": {
              "cidrBlocks": [""]
            }
          },
          "controlPlaneRef": {
            "apiVersion": "controlplane.cluster.x-k8s.io/v1beta1",
            "kind": "KubeadmControlPlane",
            "name": "",
            "namespace": ""
          },
          "infrastructureRef": {
            "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
            "kind": "KubevirtCluster",
            "name": "",
            "namespace": ""
          }
        }
      }

    KubevirtCluster = {
        "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
        "kind": "KubevirtCluster",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "controlPlaneServiceTemplate": {
            "metadata": {
              "labels": {},
              "annotations": {}
            },
            "spec": {
              "type": "",
              "externalTrafficPolicy": "Cluster"
            }
          }
        }
      }

    KubeadmControlPlane = {
        "apiVersion": "controlplane.cluster.x-k8s.io/v1beta1",
        "kind": "KubeadmControlPlane",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "kubeadmConfigSpec": {
            "clusterConfiguration": {
              "networking": {
                "dnsDomain": "",
                "podSubnet": "",
                "serviceSubnet": ""
              }
            },
            "initConfiguration": {
              "nodeRegistration": {
                "criSocket": "/var/run/containerd/containerd.sock"
              }
            },
            "joinConfiguration": {
              "nodeRegistration": {
                "criSocket": "/var/run/containerd/containerd.sock"
              }
            },
            "useExperimentalRetryJoin": true,
          },
          "machineTemplate": {
            "infrastructureRef": {
              "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
              "kind": "KubevirtMachineTemplate",
              "name": "",
              "namespace": ""
            }
          },
          "replicas": 0,
          "version": ""
        }
      }

    KubeadmConfigTemplate = {
        "apiVersion": "bootstrap.cluster.x-k8s.io/v1beta1",
        "kind": "KubeadmConfigTemplate",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "template": {
            "metadata": {
              "labels": {}
            },
            "spec": {
              "joinConfiguration": {
                "nodeRegistration": {
                  "kubeletExtraArgs": {}
                }
              },
              "useExperimentalRetryJoin": true
            }
          }
        }
      };

    MachineDeployment = {
        "apiVersion": "cluster.x-k8s.io/v1beta1",
        "kind": "MachineDeployment",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "clusterName": "",
          "replicas": 0,
          "selector": {},
          "template": {
            "metadata": {
              "labels": {}
            },
            "spec": {
              "bootstrap": {
                "configRef": {
                  "apiVersion": "bootstrap.cluster.x-k8s.io/v1beta1",
                  "kind": "KubeadmConfigTemplate",
                  "name": "",
                  "namespace": ""
                }
              },
              "clusterName": "capi-quickstart",
              "infrastructureRef": {
                "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
                "kind": "KubevirtMachineTemplate",
                "name": "",
                "namespace": ""
              },
              "version": ""
            }
          }
        }
      };

    KubevirtMachineTemplateType = {
        "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
        "kind": "KubevirtMachineTemplate",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "template": {
            "spec": {
              "virtualMachineTemplate": {
                "metadata": {
                  "namespace": "",
                  "labels": {}
                },
                "spec": {
                  "dataVolumeTemplates": [{}],
                  "running": true,
                  "instancetype": {
                    "kind": "VirtualMachineClusterInstancetype",
                    "name": ""
                  },
                  "template": {
                    "metadata": {
                      "labels": {}
                    },
                    "spec": {
                      "priorityClassName": "",
                      "domain": {
                        "devices": {
                          "disks": [{}],
                          "interfaces": [{}],
                          "networkInterfaceMultiqueue": true
                        }
                      },
                      "networks": [{}],
                      "volumes": [{}]
                    }
                  }
                }
              }
            }
          }
        }
      };

      KubevirtMachineTemplateCustom = {
        "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
        "kind": "KubevirtMachineTemplate",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "template": {
            "spec": {
              "virtualMachineTemplate": {
                "metadata": {
                  "namespace": "",
                  "labels": {}
                },
                "spec": {
                  "dataVolumeTemplates": [{}],
                  "running": true,
                  "template": {
                    "metadata": {
                      "labels": {}
                    },
                    "spec": {
                      "priorityClassName": "",
                      "domain": {
                        "cpu": {
                          "cores": 0,
                          "sockets": 0,
                          "threads": 0
                        },
                        "resources": {
                          "requests": {
                            "memory": ""
                          }
                        },
                        "devices": {
                          "disks": [{}],
                          "interfaces": [{}],
                          "networkInterfaceMultiqueue": true
                        }
                      },
                      "networks": [{}],
                      "volumes": [{}]
                    }
                  }
                }
              }
            }
          }
        }
      };

    ClusterResourceSet = {
        "apiVersion": "addons.cluster.x-k8s.io/v1alpha3",
        "kind": "ClusterResourceSet",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "clusterSelector": {
            "matchLabels": {
              "kubevirt-manager.io/cluster-name": "",
              "capk.kubevirt-manager.io/cni": ""
            }
          },
          "resources": [
            {
              "kind": "Secret",
              "name": "",
              "namespace": ""
            }
          ]
        }
      }

    ClusterConfigSecret = {
        "apiVersion": "v1",
        "kind": "Secret",
        "type": "addons.cluster.x-k8s.io/resource-set",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "data": {}
      }

    KCCMServiceAccount = {
        "apiVersion": "v1",
        "kind": "ServiceAccount",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        }
      }

    KCCMRoleBinding = {
        "apiVersion": "rbac.authorization.k8s.io/v1",
        "kind": "RoleBinding",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "roleRef": {
          "apiGroup": "rbac.authorization.k8s.io",
          "kind": "ClusterRole",
          "name": "kubevirt-manager-kccm"
        },
        "subjects": [
          {
            "kind": "ServiceAccount",
            "name": "",
            "namespace": ""
          }
        ]
      }

    KCCMConfigMap = {
        "apiVersion": "v1",
        "kind": "ConfigMap",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "data": {
          "cloud-config": ""
        }
      }

    KCCMController = {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
          "name": "",
          "namespace": "",
          "labels": {}
        },
        "spec": {
          "replicas": 1,
          "selector": {
            "matchLabels": {}
          },
          "template": {
            "metadata": {
              "labels": {}
            },
            "spec": {
              "containers": [
                {
                  "args": [
                    "--cloud-provider=kubevirt",
                    "--cloud-config=/etc/cloud/cloud-config",
                    "--kubeconfig=/etc/kubernetes/kubeconfig/value",
                    "--cluster-name=",
                    "--authentication-skip-lookup=true"
                  ],
                  "command": [
                    "/bin/kubevirt-cloud-controller-manager"
                  ],
                  "image": "quay.io/kubevirt/kubevirt-cloud-controller-manager:main",
                  "imagePullPolicy": "Always",
                  "name": "kubevirt-cloud-controller-manager",
                  "resources": {
                    "requests": {
                      "cpu": "100m"
                    }
                  },
                  "securityContext": {
                    "privileged": true
                  },
                  "volumeMounts": [
                    {
                      "mountPath": "/etc/kubernetes/kubeconfig",
                      "name": "kubeconfig",
                      "readOnly": true
                    },
                    {
                      "mountPath": "/etc/cloud",
                      "name": "cloud-config",
                      "readOnly": true
                    }
                  ]
                }
              ],
              "serviceAccountName": "",
              "volumes": [{}]
            }
          }
        }
      }

}
