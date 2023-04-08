export class K8sApisTestdata {
    static getCrds = {
        "kind":"CustomResourceDefinitionList",
        "apiVersion":"apiextensions.k8s.io/v1",
        "metadata":{
            "resourceVersion":"99999999"
        },
        "items":[
            {
                "metadata":{
                    "name":"network-attachment-definitions.k8s.cni.cncf.io",
                    "uid":"b6f95c98-1aef-4cce-83d4-fb5bd553035c",
                    "resourceVersion":"5460661",
                    "generation":1,
                    "creationTimestamp":"2022-10-25T14:03:58Z",
                    "annotations":{},
                    "managedFields":[
                        {
                            "manager":"kube-apiserver",
                            "operation":"Update",
                            "apiVersion":"apiextensions.k8s.io/v1",
                            "time":"2022-10-25T14:03:58Z",
                            "fieldsType":"FieldsV1",
                            "fieldsV1":{
                                "f:status":{
                                    "f:acceptedNames":{
                                        "f:kind":{
                                        },
                                        "f:listKind":{
                                        },
                                        "f:plural":{
                                        },
                                        "f:shortNames":{
                                        },
                                        "f:singular":{
                                        }
                                    },
                                    "f:conditions":{
                                        "k:{\"type\":\"Established\"}":{
                                            ".":{
                                            },
                                            "f:lastTransitionTime":{
                                            },
                                            "f:message":{
                                            },
                                            "f:reason":{
                                            },
                                            "f:status":{
                                            },
                                            "f:type":{
                                            }
                                        },
                                        "k:{\"type\":\"NamesAccepted\"}":{
                                            ".":{
                                            },
                                            "f:lastTransitionTime":{
                                            },
                                            "f:message":{
                                            },
                                            "f:reason":{
                                            },
                                            "f:status":{
                                            },
                                            "f:type":{
                                            }
                                        }
                                    }
                                }
                            },
                            "subresource":"status"
                        },
                        {
                            "manager":"kubectl-client-side-apply",
                            "operation":"Update",
                            "apiVersion":"apiextensions.k8s.io/v1",
                            "time":"2022-10-25T14:03:58Z",
                            "fieldsType":"FieldsV1",
                            "fieldsV1":{
                                "f:metadata":{
                                    "f:annotations":{
                                        ".":{
                                        },
                                        "f:kubectl.kubernetes.io/last-applied-configuration":{
                                        }
                                    }
                                },
                                "f:spec":{
                                    "f:conversion":{
                                        ".":{
                                        },
                                        "f:strategy":{
                                        }
                                    },
                                    "f:group":{
                                    },
                                    "f:names":{
                                        "f:kind":{
                                        },
                                        "f:listKind":{
                                        },
                                        "f:plural":{
                                        },
                                        "f:shortNames":{
                                        },
                                        "f:singular":{
                                        }
                                    },
                                    "f:scope":{
                                    },
                                    "f:versions":{
                                    }
                                }
                            }
                        }
                    ]
                },
                "spec":{
                    "group":"k8s.cni.cncf.io",
                    "names":{
                        "plural":"network-attachment-definitions",
                        "singular":"network-attachment-definition",
                        "shortNames":[
                            "net-attach-def"
                        ],
                        "kind":"NetworkAttachmentDefinition",
                        "listKind":"NetworkAttachmentDefinitionList"
                    },
                    "scope":"Namespaced",
                    "versions":[
                        {
                            "name":"v1",
                            "served":true,
                            "storage":true,
                            "schema":{
                                "openAPIV3Schema":{
                                    "description":"NetworkAttachmentDefinition is a CRD schema specified by the Network Plumbing Working Group to express the intent for attaching pods to one or more logical or physical networks. More information available at: https://github.com/k8snetworkplumbingwg/multi-net-spec",
                                    "type":"object",
                                    "properties":{
                                        "apiVersion":{
                                            "description":"APIVersion defines the versioned schema of this represen tation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
                                            "type":"string"
                                        },
                                        "kind":{
                                            "description":"Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
                                            "type":"string"
                                        },
                                        "metadata":{
                                            "type":"object"
                                        },
                                        "spec":{
                                            "description":"NetworkAttachmentDefinition spec defines the desired state of a network attachment",
                                            "type":"object",
                                            "properties":{
                                                "config":{
                                                    "description":"NetworkAttachmentDefinition config is a JSON-formatted CNI configuration",
                                                    "type":"string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    "conversion":{
                        "strategy":"None"
                    }
                },
                "status":{
                    "conditions":[
                        {
                            "type":"NamesAccepted",
                            "status":"True",
                            "lastTransitionTime":"2022-10-25T14:03:58Z",
                            "reason":"NoConflicts",
                            "message":"no conflicts found"
                        },
                        {
                            "type":"Established",
                            "status":"True",
                            "lastTransitionTime":"2022-10-25T14:03:58Z",
                            "reason":"InitialNamesAccepted",
                            "message":"the initial names have been accepted"
                        }
                    ],
                    "acceptedNames":{
                        "plural":"network-attachment-definitions",
                        "singular":"network-attachment-definition",
                        "shortNames":[
                            "net-attach-def"
                        ],
                        "kind":"NetworkAttachmentDefinition",
                        "listKind":"NetworkAttachmentDefinitionList"
                    },
                    "storedVersions":[
                        "v1"
                    ]
                }
            },
            {},
            {},
        ]
    
    };

    static getNetworkAttachs = {
        "apiVersion": "k8s.cni.cncf.io/v1",
        "items": [
          {
            "apiVersion": "k8s.cni.cncf.io/v1",
            "kind": "NetworkAttachmentDefinition",
            "metadata": {
              "annotations": {},
              "creationTimestamp": "2022-11-18T19:57:01Z",
              "generation": 1,
              "managedFields": [
                {
                  "apiVersion": "k8s.cni.cncf.io/v1",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:spec": {
                      ".": {},
                      "f:config": {}
                    }
                  },
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "time": "2022-11-18T19:57:01Z"
                }
              ],
              "name": "wifi",
              "namespace": "kubevirt",
              "resourceVersion": "16232489",
              "uid": "af033270-0854-4a58-ad1d-47f168e177c1"
            },
            "spec": {
              "config": "{ \"cniVersion\": \"0.3.1\", \"name\": \"wifi\", \"type\": \"bridge\", \"bridge\": \"brwifi\", \"ipam\": {} }"
            }
          },
          {
            "apiVersion": "k8s.cni.cncf.io/v1",
            "kind": "NetworkAttachmentDefinition",
            "metadata": {
              "annotations": {},
              "creationTimestamp": "2022-10-25T14:04:59Z",
              "generation": 1,
              "managedFields": [
                {
                  "apiVersion": "k8s.cni.cncf.io/v1",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:spec": {
                      ".": {},
                      "f:config": {}
                    }
                  },
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "time": "2022-10-25T14:04:59Z"
                }
              ],
              "name": "public",
              "namespace": "virtualmachines",
              "resourceVersion": "5461009",
              "uid": "8df2cb5d-217d-455a-a43b-8f1be802e097"
            },
            "spec": {
              "config": "{ \"cniVersion\": \"0.3.1\", \"name\": \"public\", \"type\": \"bridge\", \"bridge\": \"brpub\", \"ipam\": {} }"
            }
          },
          {
            "apiVersion": "k8s.cni.cncf.io/v1",
            "kind": "NetworkAttachmentDefinition",
            "metadata": {
              "annotations": {},
              "creationTimestamp": "2022-10-25T14:05:04Z",
              "generation": 1,
              "managedFields": [
                {
                  "apiVersion": "k8s.cni.cncf.io/v1",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:spec": {
                      ".": {},
                      "f:config": {}
                    }
                  },
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "time": "2022-10-25T14:05:04Z"
                }
              ],
              "name": "wifi",
              "namespace": "virtualmachines",
              "resourceVersion": "5461027",
              "uid": "29b72e4c-d898-45ad-bb76-ecd3819f8637"
            },
            "spec": {
              "config": "{ \"cniVersion\": \"0.3.1\", \"name\": \"wifi\", \"type\": \"bridge\", \"bridge\": \"brwifi\", \"ipam\": {} }"
            }
          }
        ],
        "kind": "NetworkAttachmentDefinitionList",
        "metadata": {
          "continue": "",
          "resourceVersion": "65924233"
        }
      };

    static getStorageClasses = {
        "kind": "StorageClassList",
        "apiVersion": "storage.k8s.io/v1",
        "metadata": {
          "resourceVersion": "65928380"
        },
        "items": [
          {
            "metadata": {
              "name": "hostpath-csi",
              "uid": "f8385f5a-b2ef-47fd-bec7-dde055a41477",
              "resourceVersion": "19033773",
              "creationTimestamp": "2022-11-24T19:51:30Z",
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "storage.k8s.io/v1",
                  "time": "2022-11-24T19:51:30Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:allowVolumeExpansion": {},
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:parameters": {
                      ".": {},
                      "f:storagePool": {}
                    },
                    "f:provisioner": {},
                    "f:reclaimPolicy": {},
                    "f:volumeBindingMode": {}
                  }
                }
              ]
            },
            "provisioner": "kubevirt.io.hostpath-provisioner",
            "parameters": {
              "storagePool": "local"
            },
            "reclaimPolicy": "Delete",
            "allowVolumeExpansion": true,
            "volumeBindingMode": "WaitForFirstConsumer"
          },
          {
            "metadata": {
              "name": "iscsi",
              "uid": "da756a98-12f5-4fe9-8550-284df95511c6",
              "resourceVersion": "42551794",
              "creationTimestamp": "2022-12-29T13:34:08Z",
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "storage.k8s.io/v1",
                  "time": "2022-12-29T13:34:08Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:allowVolumeExpansion": {},
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:provisioner": {},
                    "f:reclaimPolicy": {},
                    "f:volumeBindingMode": {}
                  }
                }
              ]
            },
            "provisioner": "qnap.terrycain.github.com",
            "reclaimPolicy": "Delete",
            "allowVolumeExpansion": false,
            "volumeBindingMode": "Immediate"
          },
          {
            "metadata": {
              "name": "nfs",
              "uid": "152e4477-074a-4740-86b2-d8188aabb2e0",
              "resourceVersion": "502165",
              "creationTimestamp": "2022-10-13T10:34:31Z",
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "storage.k8s.io/v1",
                  "time": "2022-10-13T10:34:31Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      }
                    },
                    "f:parameters": {
                      ".": {},
                      "f:accessModes": {},
                      "f:archiveOnDelete": {},
                      "f:mountOptions": {},
                      "f:pathPattern": {},
                      "f:reclaimPolicy": {}
                    },
                    "f:provisioner": {},
                    "f:reclaimPolicy": {},
                    "f:volumeBindingMode": {}
                  }
                }
              ]
            },
            "provisioner": "k8s-sigs.io/nfs-provisioner",
            "parameters": {
              "accessModes": "ReadWriteMany",
              "archiveOnDelete": "true",
              "mountOptions": "nfsvers=3",
              "pathPattern": "Volumes/${.PVC.namespace}/${.PVC.name}",
              "reclaimPolicy": "Delete"
            },
            "reclaimPolicy": "Delete",
            "volumeBindingMode": "Immediate"
          }
        ]
      };

    static getPriorityClasses = {
        "kind": "PriorityClassList",
        "apiVersion": "scheduling.k8s.io/v1",
        "metadata": {
          "resourceVersion": "65933079"
        },
        "items": [
          {
            "metadata": {
              "name": "vm-preemptible",
              "uid": "50101e8b-3447-4c84-a888-87a18856ab52",
              "resourceVersion": "65734371",
              "generation": 1,
              "creationTimestamp": "2023-01-31T14:56:43Z",
              "labels": {
                "app": "kubevirt-manager",
                "kubevirt-manager.io/managed": "true",
                "kubevirt-manager.io/version": "1.2.1"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "scheduling.k8s.io/v1",
                  "time": "2023-01-31T14:56:43Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:description": {},
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:app": {},
                        "f:kubevirt-manager.io/managed": {},
                        "f:kubevirt-manager.io/version": {}
                      }
                    },
                    "f:preemptionPolicy": {},
                    "f:value": {}
                  }
                }
              ]
            },
            "value": 1000000,
            "description": "Priority class for VMs which are allowed to be preemtited.",
            "preemptionPolicy": "PreemptLowerPriority"
          },
          {
            "metadata": {
              "name": "vm-standard",
              "uid": "7b376772-8d99-4459-8cd5-dbd28331024f",
              "resourceVersion": "65734370",
              "generation": 1,
              "creationTimestamp": "2023-01-31T14:56:43Z",
              "labels": {
                "app": "kubevirt-manager",
                "kubevirt-manager.io/managed": "true",
                "kubevirt-manager.io/version": "1.2.1"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "scheduling.k8s.io/v1",
                  "time": "2023-01-31T14:56:43Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:description": {},
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:app": {},
                        "f:kubevirt-manager.io/managed": {},
                        "f:kubevirt-manager.io/version": {}
                      }
                    },
                    "f:preemptionPolicy": {},
                    "f:value": {}
                  }
                }
              ]
            },
            "value": 999999999,
            "description": "Priority class for VMs which should not be preemtited.",
            "preemptionPolicy": "Never"
          }
        ]
      };

}
