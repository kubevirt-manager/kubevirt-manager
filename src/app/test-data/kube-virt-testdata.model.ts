export class KubeVirtTestdata {

    static getVMs = {};

    static getVM = {
        "apiVersion": "kubevirt.io/v1alpha3",
        "kind": "VirtualMachineInstance",
        "metadata": {
          "annotations": {
            "kubevirt.io/latest-observed-api-version": "v1",
            "kubevirt.io/storage-observed-api-version": "v1alpha3"
          },
          "creationTimestamp": "2023-02-01T12:24:56Z",
          "finalizers": [
            "kubevirt.io/virtualMachineControllerFinalize",
            "foregroundDeleteVirtualMachine"
          ],
          "generation": 15,
          "labels": {
            "kubevirt.io/domain": "dev-box",
            "kubevirt.io/nodeName": "node01"
          },
          "managedFields": [
            {
              "apiVersion": "kubevirt.io/v1alpha3",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:annotations": {
                    ".": {},
                    "f:kubevirt.io/latest-observed-api-version": {},
                    "f:kubevirt.io/storage-observed-api-version": {}
                  },
                  "f:finalizers": {
                    ".": {},
                    "v:\"kubevirt.io/virtualMachineControllerFinalize\"": {}
                  },
                  "f:labels": {
                    ".": {},
                    "f:kubevirt.io/domain": {},
                    "f:kubevirt.io/nodeName": {}
                  },
                  "f:ownerReferences": {
                    ".": {},
                    "k:{\"uid\":\"ed760b88-e04f-4bab-a413-185411b658be\"}": {}
                  }
                },
                "f:spec": {
                  ".": {},
                  "f:domain": {
                    ".": {},
                    "f:cpu": {
                      ".": {},
                      "f:cores": {},
                      "f:sockets": {},
                      "f:threads": {}
                    },
                    "f:devices": {
                      ".": {},
                      "f:disks": {},
                      "f:interfaces": {}
                    },
                    "f:firmware": {
                      ".": {},
                      "f:uuid": {}
                    },
                    "f:machine": {
                      ".": {},
                      "f:type": {}
                    },
                    "f:resources": {
                      ".": {},
                      "f:requests": {
                        ".": {},
                        "f:memory": {}
                      }
                    }
                  },
                  "f:networks": {},
                  "f:nodeSelector": {
                    ".": {},
                    "f:kubernetes.io/hostname": {}
                  },
                  "f:volumes": {}
                },
                "f:status": {
                  ".": {},
                  "f:activePods": {
                    ".": {},
                    "f:949fafbb-039d-455f-9505-1f9747a33062": {}
                  },
                  "f:conditions": {},
                  "f:guestOSInfo": {
                    ".": {},
                    "f:id": {},
                    "f:kernelRelease": {},
                    "f:kernelVersion": {},
                    "f:name": {},
                    "f:prettyName": {},
                    "f:version": {},
                    "f:versionId": {}
                  },
                  "f:interfaces": {},
                  "f:launcherContainerImageVersion": {},
                  "f:migrationMethod": {},
                  "f:migrationTransport": {},
                  "f:nodeName": {},
                  "f:phase": {},
                  "f:phaseTransitionTimestamps": {},
                  "f:qosClass": {},
                  "f:runtimeUser": {},
                  "f:virtualMachineRevisionName": {},
                  "f:volumeStatus": {}
                }
              },
              "manager": "Go-http-client",
              "operation": "Update",
              "time": "2023-02-01T12:25:26Z"
            }
          ],
          "name": "dev-box",
          "namespace": "virtualmachines",
          "ownerReferences": [
            {
              "apiVersion": "kubevirt.io/v1",
              "blockOwnerDeletion": true,
              "controller": true,
              "kind": "VirtualMachine",
              "name": "dev-box",
              "uid": "ed760b88-e04f-4bab-a413-185411b658be"
            }
          ],
          "resourceVersion": "66104014",
          "uid": "8cc1e93e-e8ca-4c14-8fcb-86ad499319df"
        },
        "spec": {
          "domain": {
            "cpu": {
              "cores": 1,
              "model": "host-model",
              "sockets": 3,
              "threads": 2
            },
            "devices": {
              "disks": [
                {
                  "disk": {
                    "bus": "sata"
                  },
                  "name": "disk1"
                },
                {
                  "disk": {
                    "bus": "virtio"
                  },
                  "name": "disk2"
                }
              ],
              "interfaces": [
                {
                  "bridge": {},
                  "name": "br0"
                }
              ]
            },
            "features": {
              "acpi": {
                "enabled": true
              }
            },
            "firmware": {
              "uuid": "7ba2624c-094f-59c2-9d9e-461ddca049c6"
            },
            "machine": {
              "type": "q35"
            },
            "resources": {
              "requests": {
                "memory": "12Gi"
              }
            }
          },
          "networks": [
            {
              "multus": {
                "networkName": "wifi"
              },
              "name": "br0"
            }
          ],
          "nodeSelector": {
            "kubernetes.io/hostname": "node01"
          },
          "volumes": [
            {
              "hostDisk": {
                "capacity": "0",
                "path": "/opt/kubelocal/disks/virtualmachines-dev-box-disk1.img",
                "type": "Disk"
              },
              "name": "disk1"
            },
            {
              "cloudInitNoCloud": {
                "networkDataBase64": "dmVyc2lvbjogMQpjb25maWc6CiAgICAtIHR5cGU6IHBoeXNpY2FsCiAgICAgIG5hbWU6IGVucDFzMAogICAgICBzdWJuZXRzOgogICAgICAtIHR5cGU6IHN0YXRpYwogICAgICAgIGFkZHJlc3M6ICcxNzIuMTYuMTQ1LjMnCiAgICAgICAgbmV0bWFzazogJzI1NS4yNTUuMjU1LjAnCiAgICAgICAgZ2F0ZXdheTogJzE3Mi4xNi4xNDUuMScKICAgIC0gdHlwZTogbmFtZXNlcnZlcgogICAgICBhZGRyZXNzOgogICAgICAtICc4LjguOC44JwogICAgICBzZWFyY2g6CiAgICAgIC0gJ2Zha2UuY29ycC5mZWl0b3phLmNvbS5icicK",
                "userDataBase64": "I2Nsb3VkLWNvbmZpZwpob3N0bmFtZTogZGV2LWJveC5jb3JwLmZlaXRvemEuY29tLmJyCm1hbmFnZV9ldGNfaG9zdHM6IHRydWUKdXNlcjogdWJ1bnR1CnBhc3N3b3JkOiB1YnVudHUxMjM0Cg=="
              },
              "name": "disk2"
            }
          ]
        },
        "status": {
          "activePods": {
            "949fafbb-039d-455f-9505-1f9747a33062": "node01"
          },
          "conditions": [
            {
              "lastProbeTime": null,
              "lastTransitionTime": "2023-02-01T12:24:57Z",
              "status": "True",
              "type": "Ready"
            },
            {
              "lastProbeTime": null,
              "lastTransitionTime": null,
              "message": "cannot migrate VMI with non-shared HostDisk",
              "reason": "DisksNotLiveMigratable",
              "status": "False",
              "type": "LiveMigratable"
            },
            {
              "lastProbeTime": "2023-02-01T12:25:26Z",
              "lastTransitionTime": null,
              "status": "True",
              "type": "AgentConnected"
            }
          ],
          "guestOSInfo": {
            "id": "ubuntu",
            "kernelRelease": "5.15.0-58-generic",
            "kernelVersion": "#64-Ubuntu SMP Thu Jan 5 11:43:13 UTC 2023",
            "name": "Ubuntu",
            "prettyName": "Ubuntu 22.04.1 LTS",
            "version": "22.04",
            "versionId": "22.04"
          },
          "interfaces": [
            {
              "infoSource": "domain, guest-agent",
              "interfaceName": "enp1s0",
              "ipAddress": "172.16.145.3",
              "ipAddresses": [
                "172.16.145.3",
                "fe80::f01e:ffff:feb4:c10d"
              ],
              "mac": "f2:1e:ff:b4:c1:0d",
              "name": "br0",
              "queueCount": 1
            },
            {
              "infoSource": "guest-agent",
              "interfaceName": "docker0",
              "ipAddress": "172.17.0.1",
              "ipAddresses": [
                "172.17.0.1",
                "fe80::42:2cff:fe45:9e18"
              ],
              "mac": "02:42:2c:45:9e:18"
            },
            {
              "infoSource": "guest-agent",
              "interfaceName": "br-5993cd840d06",
              "ipAddress": "192.168.49.1",
              "ipAddresses": [
                "192.168.49.1"
              ],
              "mac": "02:42:c8:44:24:f1"
            }
          ],
          "launcherContainerImageVersion": "quay.io/kubevirt/virt-launcher:v0.57.1",
          "migrationMethod": "BlockMigration",
          "migrationTransport": "Unix",
          "nodeName": "node01",
          "phase": "Running",
          "phaseTransitionTimestamps": [
            {
              "phase": "Pending",
              "phaseTransitionTimestamp": "2023-02-01T12:24:56Z"
            },
            {
              "phase": "Scheduling",
              "phaseTransitionTimestamp": "2023-02-01T12:24:56Z"
            },
            {
              "phase": "Scheduled",
              "phaseTransitionTimestamp": "2023-02-01T12:24:57Z"
            },
            {
              "phase": "Running",
              "phaseTransitionTimestamp": "2023-02-01T12:25:00Z"
            }
          ],
          "qosClass": "Burstable",
          "runtimeUser": 0,
          "virtualMachineRevisionName": "revision-start-vm-ed760b88-e04f-4bab-a413-185411b658be-15",
          "volumeStatus": [
            {
              "name": "disk1",
              "target": "sda"
            },
            {
              "name": "disk2",
              "size": 1048576,
              "target": "vda"
            }
          ]
        }
      };
}
