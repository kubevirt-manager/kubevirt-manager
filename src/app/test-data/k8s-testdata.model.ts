export class K8sTestdata {
    static getNodes = {
        "kind": "NodeList",
        "apiVersion": "v1",
        "metadata": {
          "resourceVersion": "65954691"
        },
        "items": [
          {
            "metadata": {
              "name": "node01",
              "uid": "d52384f6-3c3b-4fc4-bffe-f6155c30a950",
              "resourceVersion": "65953979",
              "creationTimestamp": "2022-10-11T19:50:19Z",
              "labels": {
                "beta.kubernetes.io/arch": "amd64",
                "beta.kubernetes.io/os": "linux",
                "cpu-feature.node.kubevirt.io/aes": "true",
                "cpu-feature.node.kubevirt.io/amd-ssbd": "true",
                "cpu-feature.node.kubevirt.io/amd-stibp": "true",
                "cpu-feature.node.kubevirt.io/apic": "true",
                "cpu-feature.node.kubevirt.io/arat": "true",
                "cpu-feature.node.kubevirt.io/arch-capabilities": "true",
                "cpu-feature.node.kubevirt.io/avx": "true",
                "cpu-feature.node.kubevirt.io/clflush": "true",
                "cpu-feature.node.kubevirt.io/cmov": "true",
                "cpu-feature.node.kubevirt.io/cx16": "true",
                "cpu-feature.node.kubevirt.io/cx8": "true",
                "cpu-feature.node.kubevirt.io/de": "true",
                "cpu-feature.node.kubevirt.io/erms": "true",
                "cpu-feature.node.kubevirt.io/f16c": "true",
                "cpu-feature.node.kubevirt.io/fpu": "true",
                "cpu-feature.node.kubevirt.io/fsgsbase": "true",
                "cpu-feature.node.kubevirt.io/fxsr": "true",
                "cpu-feature.node.kubevirt.io/hypervisor": "true",
                "cpu-feature.node.kubevirt.io/ibpb": "true",
                "cpu-feature.node.kubevirt.io/ibrs": "true",
                "cpu-feature.node.kubevirt.io/invtsc": "true",
                "cpu-feature.node.kubevirt.io/lahf_lm": "true",
                "cpu-feature.node.kubevirt.io/lm": "true",
                "cpu-feature.node.kubevirt.io/mca": "true",
                "cpu-feature.node.kubevirt.io/mce": "true",
                "cpu-feature.node.kubevirt.io/md-clear": "true",
                "cpu-feature.node.kubevirt.io/mmx": "true",
                "cpu-feature.node.kubevirt.io/msr": "true",
                "cpu-feature.node.kubevirt.io/mtrr": "true",
                "cpu-feature.node.kubevirt.io/nx": "true",
                "cpu-feature.node.kubevirt.io/pae": "true",
                "cpu-feature.node.kubevirt.io/pat": "true",
                "cpu-feature.node.kubevirt.io/pcid": "true",
                "cpu-feature.node.kubevirt.io/pclmuldq": "true",
                "cpu-feature.node.kubevirt.io/pdcm": "true",
                "cpu-feature.node.kubevirt.io/pge": "true",
                "cpu-feature.node.kubevirt.io/pni": "true",
                "cpu-feature.node.kubevirt.io/popcnt": "true",
                "cpu-feature.node.kubevirt.io/pschange-mc-no": "true",
                "cpu-feature.node.kubevirt.io/pse": "true",
                "cpu-feature.node.kubevirt.io/pse36": "true",
                "cpu-feature.node.kubevirt.io/rdrand": "true",
                "cpu-feature.node.kubevirt.io/rdtscp": "true",
                "cpu-feature.node.kubevirt.io/sep": "true",
                "cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "cpu-feature.node.kubevirt.io/smep": "true",
                "cpu-feature.node.kubevirt.io/spec-ctrl": "true",
                "cpu-feature.node.kubevirt.io/ss": "true",
                "cpu-feature.node.kubevirt.io/ssbd": "true",
                "cpu-feature.node.kubevirt.io/sse": "true",
                "cpu-feature.node.kubevirt.io/sse2": "true",
                "cpu-feature.node.kubevirt.io/sse4.1": "true",
                "cpu-feature.node.kubevirt.io/sse4.2": "true",
                "cpu-feature.node.kubevirt.io/ssse3": "true",
                "cpu-feature.node.kubevirt.io/stibp": "true",
                "cpu-feature.node.kubevirt.io/syscall": "true",
                "cpu-feature.node.kubevirt.io/tsc": "true",
                "cpu-feature.node.kubevirt.io/tsc-deadline": "true",
                "cpu-feature.node.kubevirt.io/tsc_adjust": "true",
                "cpu-feature.node.kubevirt.io/umip": "true",
                "cpu-feature.node.kubevirt.io/vme": "true",
                "cpu-feature.node.kubevirt.io/vmx": "true",
                "cpu-feature.node.kubevirt.io/x2apic": "true",
                "cpu-feature.node.kubevirt.io/xsave": "true",
                "cpu-feature.node.kubevirt.io/xsaveopt": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model-migration.node.kubevirt.io/Penryn": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-model.node.kubevirt.io/IvyBridge": "true",
                "cpu-model.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Nehalem": "true",
                "cpu-model.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model.node.kubevirt.io/Penryn": "true",
                "cpu-model.node.kubevirt.io/SandyBridge": "true",
                "cpu-model.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Westmere": "true",
                "cpu-model.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-timer.node.kubevirt.io/tsc-frequency": "2294787000",
                "cpu-timer.node.kubevirt.io/tsc-scalable": "false",
                "cpu-vendor.node.kubevirt.io/Intel": "true",
                "cpumanager": "false",
                "disk-type": "ssd",
                "host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": "true",
                "host-model-required-features.node.kubevirt.io/amd-ssbd": "true",
                "host-model-required-features.node.kubevirt.io/amd-stibp": "true",
                "host-model-required-features.node.kubevirt.io/arat": "true",
                "host-model-required-features.node.kubevirt.io/arch-capabilities": "true",
                "host-model-required-features.node.kubevirt.io/hypervisor": "true",
                "host-model-required-features.node.kubevirt.io/ibpb": "true",
                "host-model-required-features.node.kubevirt.io/ibrs": "true",
                "host-model-required-features.node.kubevirt.io/invtsc": "true",
                "host-model-required-features.node.kubevirt.io/md-clear": "true",
                "host-model-required-features.node.kubevirt.io/pcid": "true",
                "host-model-required-features.node.kubevirt.io/pdcm": "true",
                "host-model-required-features.node.kubevirt.io/pschange-mc-no": "true",
                "host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "host-model-required-features.node.kubevirt.io/ss": "true",
                "host-model-required-features.node.kubevirt.io/ssbd": "true",
                "host-model-required-features.node.kubevirt.io/stibp": "true",
                "host-model-required-features.node.kubevirt.io/tsc_adjust": "true",
                "host-model-required-features.node.kubevirt.io/umip": "true",
                "host-model-required-features.node.kubevirt.io/vmx": "true",
                "host-model-required-features.node.kubevirt.io/xsaveopt": "true",
                "hyperv.node.kubevirt.io/base": "true",
                "hyperv.node.kubevirt.io/frequencies": "true",
                "hyperv.node.kubevirt.io/ipi": "true",
                "hyperv.node.kubevirt.io/reenlightenment": "true",
                "hyperv.node.kubevirt.io/reset": "true",
                "hyperv.node.kubevirt.io/runtime": "true",
                "hyperv.node.kubevirt.io/synic": "true",
                "hyperv.node.kubevirt.io/synic2": "true",
                "hyperv.node.kubevirt.io/synictimer": "true",
                "hyperv.node.kubevirt.io/time": "true",
                "hyperv.node.kubevirt.io/tlbflush": "true",
                "hyperv.node.kubevirt.io/vpindex": "true",
                "kubernetes.io/arch": "amd64",
                "kubernetes.io/hostname": "node01",
                "kubernetes.io/os": "linux",
                "kubevirt.io/schedulable": "true",
                "node-role.kubernetes.io/control-plane": "",
                "node.kubernetes.io/exclude-from-external-load-balancers": "",
                "scheduling.node.kubevirt.io/tsc-frequency-2294787000": "true",
                "topology.hostpath.csi/node": "node01"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:50:18Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:volumes.kubernetes.io/controller-managed-attach-detach": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:beta.kubernetes.io/arch": {},
                        "f:beta.kubernetes.io/os": {},
                        "f:kubernetes.io/arch": {},
                        "f:kubernetes.io/hostname": {},
                        "f:kubernetes.io/os": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubeadm",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:50:22Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubeadm.alpha.kubernetes.io/cri-socket": {}
                      },
                      "f:labels": {
                        "f:node-role.kubernetes.io/control-plane": {},
                        "f:node.kubernetes.io/exclude-from-external-load-balancers": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-operator-generic",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T20:12:41Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:status": {
                      "f:conditions": {
                        "k:{\"type\":\"NetworkUnavailable\"}": {
                          ".": {},
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {},
                          "f:type": {}
                        }
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kubectl-label",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-12T00:00:14Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        "f:disk-type": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kube-controller-manager",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-14T21:49:02Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:node.alpha.kubernetes.io/ttl": {}
                      }
                    },
                    "f:spec": {
                      "f:podCIDR": {},
                      "f:podCIDRs": {
                        ".": {},
                        "v:\"10.244.0.0/24\"": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-agent",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-25T18:18:24Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:io.cilium.network.ipv4-cilium-host": {},
                        "f:io.cilium.network.ipv4-health-ip": {},
                        "f:io.cilium.network.ipv4-pod-cidr": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-12-14T09:19:03Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:csi.volume.kubernetes.io/nodeid": {}
                      },
                      "f:labels": {
                        "f:topology.hostpath.csi/node": {}
                      }
                    },
                    "f:status": {
                      "f:addresses": {
                        "k:{\"type\":\"InternalIP\"}": {
                          "f:address": {}
                        }
                      },
                      "f:allocatable": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:memory": {}
                      },
                      "f:capacity": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:memory": {}
                      },
                      "f:conditions": {
                        "k:{\"type\":\"DiskPressure\"}": {
                          "f:lastHeartbeatTime": {}
                        },
                        "k:{\"type\":\"MemoryPressure\"}": {
                          "f:lastHeartbeatTime": {}
                        },
                        "k:{\"type\":\"PIDPressure\"}": {
                          "f:lastHeartbeatTime": {}
                        },
                        "k:{\"type\":\"Ready\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        }
                      },
                      "f:images": {},
                      "f:nodeInfo": {
                        "f:bootID": {},
                        "f:containerRuntimeVersion": {},
                        "f:kernelVersion": {}
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "Go-http-client",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:08:34Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubevirt.io/heartbeat": {}
                      },
                      "f:labels": {
                        "f:cpu-feature.node.kubevirt.io/aes": {},
                        "f:cpu-feature.node.kubevirt.io/amd-ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/amd-stibp": {},
                        "f:cpu-feature.node.kubevirt.io/apic": {},
                        "f:cpu-feature.node.kubevirt.io/arat": {},
                        "f:cpu-feature.node.kubevirt.io/arch-capabilities": {},
                        "f:cpu-feature.node.kubevirt.io/avx": {},
                        "f:cpu-feature.node.kubevirt.io/clflush": {},
                        "f:cpu-feature.node.kubevirt.io/cmov": {},
                        "f:cpu-feature.node.kubevirt.io/cx16": {},
                        "f:cpu-feature.node.kubevirt.io/cx8": {},
                        "f:cpu-feature.node.kubevirt.io/de": {},
                        "f:cpu-feature.node.kubevirt.io/erms": {},
                        "f:cpu-feature.node.kubevirt.io/f16c": {},
                        "f:cpu-feature.node.kubevirt.io/fpu": {},
                        "f:cpu-feature.node.kubevirt.io/fsgsbase": {},
                        "f:cpu-feature.node.kubevirt.io/fxsr": {},
                        "f:cpu-feature.node.kubevirt.io/hypervisor": {},
                        "f:cpu-feature.node.kubevirt.io/ibpb": {},
                        "f:cpu-feature.node.kubevirt.io/ibrs": {},
                        "f:cpu-feature.node.kubevirt.io/invtsc": {},
                        "f:cpu-feature.node.kubevirt.io/lahf_lm": {},
                        "f:cpu-feature.node.kubevirt.io/lm": {},
                        "f:cpu-feature.node.kubevirt.io/mca": {},
                        "f:cpu-feature.node.kubevirt.io/mce": {},
                        "f:cpu-feature.node.kubevirt.io/md-clear": {},
                        "f:cpu-feature.node.kubevirt.io/mmx": {},
                        "f:cpu-feature.node.kubevirt.io/msr": {},
                        "f:cpu-feature.node.kubevirt.io/mtrr": {},
                        "f:cpu-feature.node.kubevirt.io/nx": {},
                        "f:cpu-feature.node.kubevirt.io/pae": {},
                        "f:cpu-feature.node.kubevirt.io/pat": {},
                        "f:cpu-feature.node.kubevirt.io/pcid": {},
                        "f:cpu-feature.node.kubevirt.io/pclmuldq": {},
                        "f:cpu-feature.node.kubevirt.io/pdcm": {},
                        "f:cpu-feature.node.kubevirt.io/pge": {},
                        "f:cpu-feature.node.kubevirt.io/pni": {},
                        "f:cpu-feature.node.kubevirt.io/popcnt": {},
                        "f:cpu-feature.node.kubevirt.io/pschange-mc-no": {},
                        "f:cpu-feature.node.kubevirt.io/pse": {},
                        "f:cpu-feature.node.kubevirt.io/pse36": {},
                        "f:cpu-feature.node.kubevirt.io/rdrand": {},
                        "f:cpu-feature.node.kubevirt.io/rdtscp": {},
                        "f:cpu-feature.node.kubevirt.io/sep": {},
                        "f:cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:cpu-feature.node.kubevirt.io/smep": {},
                        "f:cpu-feature.node.kubevirt.io/spec-ctrl": {},
                        "f:cpu-feature.node.kubevirt.io/ss": {},
                        "f:cpu-feature.node.kubevirt.io/ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/sse": {},
                        "f:cpu-feature.node.kubevirt.io/sse2": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.1": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.2": {},
                        "f:cpu-feature.node.kubevirt.io/ssse3": {},
                        "f:cpu-feature.node.kubevirt.io/stibp": {},
                        "f:cpu-feature.node.kubevirt.io/syscall": {},
                        "f:cpu-feature.node.kubevirt.io/tsc": {},
                        "f:cpu-feature.node.kubevirt.io/tsc-deadline": {},
                        "f:cpu-feature.node.kubevirt.io/tsc_adjust": {},
                        "f:cpu-feature.node.kubevirt.io/umip": {},
                        "f:cpu-feature.node.kubevirt.io/vme": {},
                        "f:cpu-feature.node.kubevirt.io/vmx": {},
                        "f:cpu-feature.node.kubevirt.io/x2apic": {},
                        "f:cpu-feature.node.kubevirt.io/xsave": {},
                        "f:cpu-feature.node.kubevirt.io/xsaveopt": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model-migration.node.kubevirt.io/Penryn": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model.node.kubevirt.io/Penryn": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Westmere": {},
                        "f:cpu-model.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-frequency": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-scalable": {},
                        "f:cpu-vendor.node.kubevirt.io/Intel": {},
                        "f:cpumanager": {},
                        "f:host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/arat": {},
                        "f:host-model-required-features.node.kubevirt.io/arch-capabilities": {},
                        "f:host-model-required-features.node.kubevirt.io/hypervisor": {},
                        "f:host-model-required-features.node.kubevirt.io/ibpb": {},
                        "f:host-model-required-features.node.kubevirt.io/ibrs": {},
                        "f:host-model-required-features.node.kubevirt.io/invtsc": {},
                        "f:host-model-required-features.node.kubevirt.io/md-clear": {},
                        "f:host-model-required-features.node.kubevirt.io/pcid": {},
                        "f:host-model-required-features.node.kubevirt.io/pdcm": {},
                        "f:host-model-required-features.node.kubevirt.io/pschange-mc-no": {},
                        "f:host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:host-model-required-features.node.kubevirt.io/ss": {},
                        "f:host-model-required-features.node.kubevirt.io/ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/tsc_adjust": {},
                        "f:host-model-required-features.node.kubevirt.io/umip": {},
                        "f:host-model-required-features.node.kubevirt.io/vmx": {},
                        "f:host-model-required-features.node.kubevirt.io/xsaveopt": {},
                        "f:hyperv.node.kubevirt.io/base": {},
                        "f:hyperv.node.kubevirt.io/frequencies": {},
                        "f:hyperv.node.kubevirt.io/ipi": {},
                        "f:hyperv.node.kubevirt.io/reenlightenment": {},
                        "f:hyperv.node.kubevirt.io/reset": {},
                        "f:hyperv.node.kubevirt.io/runtime": {},
                        "f:hyperv.node.kubevirt.io/synic": {},
                        "f:hyperv.node.kubevirt.io/synic2": {},
                        "f:hyperv.node.kubevirt.io/synictimer": {},
                        "f:hyperv.node.kubevirt.io/time": {},
                        "f:hyperv.node.kubevirt.io/tlbflush": {},
                        "f:hyperv.node.kubevirt.io/vpindex": {},
                        "f:kubevirt.io/schedulable": {},
                        "f:scheduling.node.kubevirt.io/tsc-frequency-2294787000": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "podCIDR": "10.244.0.0/24",
              "podCIDRs": [
                "10.244.0.0/24"
              ]
            },
            "status": {
              "capacity": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "490048472Ki",
                "hugepages-2Mi": "0",
                "memory": "16289024Ki",
                "pods": "110"
              },
              "allocatable": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "451628671048",
                "hugepages-2Mi": "0",
                "memory": "16186624Ki",
                "pods": "110"
              },
              "conditions": [],
              "addresses": [],
              "daemonEndpoints": {
                "kubeletEndpoint": {
                  "Port": 10250
                }
              },
              "nodeInfo": {
                "machineID": "1f3d9139fe7c4ead8aba7b55d2915a2c",
                "systemUUID": "4ce4f22a-bd99-5e57-b13b-01a0e2c671dc",
                "bootID": "466cac2f-50b7-46d0-bdbc-b12fe6c29ec3",
                "kernelVersion": "5.15.0-58-generic",
                "osImage": "Linux",
                "containerRuntimeVersion": "containerd://1.5.9",
                "kubeletVersion": "v1.24.6",
                "kubeProxyVersion": "v1.24.6",
                "operatingSystem": "linux",
                "architecture": "amd64"
              },
              "images": []
            }
          },
          {
            "metadata": {
              "name": "node02",
              "uid": "ac8aee95-6d29-46f2-afa9-8663fc15cc53",
              "resourceVersion": "65954545",
              "creationTimestamp": "2022-10-11T19:51:13Z",
              "labels": {
                "beta.kubernetes.io/arch": "amd64",
                "beta.kubernetes.io/os": "linux",
                "cpu-feature.node.kubevirt.io/aes": "true",
                "cpu-feature.node.kubevirt.io/amd-ssbd": "true",
                "cpu-feature.node.kubevirt.io/amd-stibp": "true",
                "cpu-feature.node.kubevirt.io/apic": "true",
                "cpu-feature.node.kubevirt.io/arat": "true",
                "cpu-feature.node.kubevirt.io/arch-capabilities": "true",
                "cpu-feature.node.kubevirt.io/avx": "true",
                "cpu-feature.node.kubevirt.io/clflush": "true",
                "cpu-feature.node.kubevirt.io/cmov": "true",
                "cpu-feature.node.kubevirt.io/cx16": "true",
                "cpu-feature.node.kubevirt.io/cx8": "true",
                "cpu-feature.node.kubevirt.io/de": "true",
                "cpu-feature.node.kubevirt.io/erms": "true",
                "cpu-feature.node.kubevirt.io/f16c": "true",
                "cpu-feature.node.kubevirt.io/fpu": "true",
                "cpu-feature.node.kubevirt.io/fsgsbase": "true",
                "cpu-feature.node.kubevirt.io/fxsr": "true",
                "cpu-feature.node.kubevirt.io/hypervisor": "true",
                "cpu-feature.node.kubevirt.io/ibpb": "true",
                "cpu-feature.node.kubevirt.io/ibrs": "true",
                "cpu-feature.node.kubevirt.io/invtsc": "true",
                "cpu-feature.node.kubevirt.io/lahf_lm": "true",
                "cpu-feature.node.kubevirt.io/lm": "true",
                "cpu-feature.node.kubevirt.io/mca": "true",
                "cpu-feature.node.kubevirt.io/mce": "true",
                "cpu-feature.node.kubevirt.io/md-clear": "true",
                "cpu-feature.node.kubevirt.io/mmx": "true",
                "cpu-feature.node.kubevirt.io/msr": "true",
                "cpu-feature.node.kubevirt.io/mtrr": "true",
                "cpu-feature.node.kubevirt.io/nx": "true",
                "cpu-feature.node.kubevirt.io/pae": "true",
                "cpu-feature.node.kubevirt.io/pat": "true",
                "cpu-feature.node.kubevirt.io/pcid": "true",
                "cpu-feature.node.kubevirt.io/pclmuldq": "true",
                "cpu-feature.node.kubevirt.io/pdcm": "true",
                "cpu-feature.node.kubevirt.io/pge": "true",
                "cpu-feature.node.kubevirt.io/pni": "true",
                "cpu-feature.node.kubevirt.io/popcnt": "true",
                "cpu-feature.node.kubevirt.io/pschange-mc-no": "true",
                "cpu-feature.node.kubevirt.io/pse": "true",
                "cpu-feature.node.kubevirt.io/pse36": "true",
                "cpu-feature.node.kubevirt.io/rdrand": "true",
                "cpu-feature.node.kubevirt.io/rdtscp": "true",
                "cpu-feature.node.kubevirt.io/sep": "true",
                "cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "cpu-feature.node.kubevirt.io/smep": "true",
                "cpu-feature.node.kubevirt.io/spec-ctrl": "true",
                "cpu-feature.node.kubevirt.io/ss": "true",
                "cpu-feature.node.kubevirt.io/ssbd": "true",
                "cpu-feature.node.kubevirt.io/sse": "true",
                "cpu-feature.node.kubevirt.io/sse2": "true",
                "cpu-feature.node.kubevirt.io/sse4.1": "true",
                "cpu-feature.node.kubevirt.io/sse4.2": "true",
                "cpu-feature.node.kubevirt.io/ssse3": "true",
                "cpu-feature.node.kubevirt.io/stibp": "true",
                "cpu-feature.node.kubevirt.io/syscall": "true",
                "cpu-feature.node.kubevirt.io/tsc": "true",
                "cpu-feature.node.kubevirt.io/tsc-deadline": "true",
                "cpu-feature.node.kubevirt.io/tsc_adjust": "true",
                "cpu-feature.node.kubevirt.io/umip": "true",
                "cpu-feature.node.kubevirt.io/vme": "true",
                "cpu-feature.node.kubevirt.io/vmx": "true",
                "cpu-feature.node.kubevirt.io/x2apic": "true",
                "cpu-feature.node.kubevirt.io/xsave": "true",
                "cpu-feature.node.kubevirt.io/xsaveopt": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model-migration.node.kubevirt.io/Penryn": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-model.node.kubevirt.io/IvyBridge": "true",
                "cpu-model.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Nehalem": "true",
                "cpu-model.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model.node.kubevirt.io/Penryn": "true",
                "cpu-model.node.kubevirt.io/SandyBridge": "true",
                "cpu-model.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Westmere": "true",
                "cpu-model.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-timer.node.kubevirt.io/tsc-frequency": "2294785000",
                "cpu-timer.node.kubevirt.io/tsc-scalable": "false",
                "cpu-vendor.node.kubevirt.io/Intel": "true",
                "cpumanager": "false",
                "disk-type": "hdd",
                "host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": "true",
                "host-model-required-features.node.kubevirt.io/amd-ssbd": "true",
                "host-model-required-features.node.kubevirt.io/amd-stibp": "true",
                "host-model-required-features.node.kubevirt.io/arat": "true",
                "host-model-required-features.node.kubevirt.io/arch-capabilities": "true",
                "host-model-required-features.node.kubevirt.io/hypervisor": "true",
                "host-model-required-features.node.kubevirt.io/ibpb": "true",
                "host-model-required-features.node.kubevirt.io/ibrs": "true",
                "host-model-required-features.node.kubevirt.io/invtsc": "true",
                "host-model-required-features.node.kubevirt.io/md-clear": "true",
                "host-model-required-features.node.kubevirt.io/pcid": "true",
                "host-model-required-features.node.kubevirt.io/pdcm": "true",
                "host-model-required-features.node.kubevirt.io/pschange-mc-no": "true",
                "host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "host-model-required-features.node.kubevirt.io/ss": "true",
                "host-model-required-features.node.kubevirt.io/ssbd": "true",
                "host-model-required-features.node.kubevirt.io/stibp": "true",
                "host-model-required-features.node.kubevirt.io/tsc_adjust": "true",
                "host-model-required-features.node.kubevirt.io/umip": "true",
                "host-model-required-features.node.kubevirt.io/vmx": "true",
                "host-model-required-features.node.kubevirt.io/xsaveopt": "true",
                "hyperv.node.kubevirt.io/base": "true",
                "hyperv.node.kubevirt.io/frequencies": "true",
                "hyperv.node.kubevirt.io/ipi": "true",
                "hyperv.node.kubevirt.io/reenlightenment": "true",
                "hyperv.node.kubevirt.io/reset": "true",
                "hyperv.node.kubevirt.io/runtime": "true",
                "hyperv.node.kubevirt.io/synic": "true",
                "hyperv.node.kubevirt.io/synic2": "true",
                "hyperv.node.kubevirt.io/synictimer": "true",
                "hyperv.node.kubevirt.io/time": "true",
                "hyperv.node.kubevirt.io/tlbflush": "true",
                "hyperv.node.kubevirt.io/vpindex": "true",
                "kubernetes.io/arch": "amd64",
                "kubernetes.io/hostname": "node02",
                "kubernetes.io/os": "linux",
                "kubevirt.io/schedulable": "true",
                "scheduling.node.kubevirt.io/tsc-frequency-2294785000": "true",
                "topology.hostpath.csi/node": "node02"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:13Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:volumes.kubernetes.io/controller-managed-attach-detach": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:beta.kubernetes.io/arch": {},
                        "f:beta.kubernetes.io/os": {},
                        "f:kubernetes.io/arch": {},
                        "f:kubernetes.io/hostname": {},
                        "f:kubernetes.io/os": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubeadm",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:14Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubeadm.alpha.kubernetes.io/cri-socket": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-operator-generic",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T20:12:59Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:status": {
                      "f:conditions": {
                        "k:{\"type\":\"NetworkUnavailable\"}": {
                          ".": {},
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {},
                          "f:type": {}
                        }
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kubectl-label",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-12T00:00:25Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        "f:disk-type": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-agent",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-25T18:17:44Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:io.cilium.network.ipv4-cilium-host": {},
                        "f:io.cilium.network.ipv4-health-ip": {},
                        "f:io.cilium.network.ipv4-pod-cidr": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-17T20:58:16Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:csi.volume.kubernetes.io/nodeid": {}
                      },
                      "f:labels": {
                        "f:topology.hostpath.csi/node": {}
                      }
                    },
                    "f:status": {
                      "f:allocatable": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:ephemeral-storage": {},
                        "f:memory": {}
                      },
                      "f:capacity": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:memory": {}
                      },
                      "f:conditions": {
                        "k:{\"type\":\"DiskPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"MemoryPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"PIDPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"Ready\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        }
                      },
                      "f:images": {},
                      "f:nodeInfo": {
                        "f:bootID": {},
                        "f:containerRuntimeVersion": {},
                        "f:kernelVersion": {}
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kube-controller-manager",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:06:34Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:node.alpha.kubernetes.io/ttl": {}
                      }
                    },
                    "f:spec": {
                      "f:podCIDR": {},
                      "f:podCIDRs": {
                        ".": {},
                        "v:\"10.244.1.0/24\"": {}
                      }
                    }
                  }
                },
                {
                  "manager": "Go-http-client",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:10:11Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubevirt.io/heartbeat": {}
                      },
                      "f:labels": {
                        "f:cpu-feature.node.kubevirt.io/aes": {},
                        "f:cpu-feature.node.kubevirt.io/amd-ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/amd-stibp": {},
                        "f:cpu-feature.node.kubevirt.io/apic": {},
                        "f:cpu-feature.node.kubevirt.io/arat": {},
                        "f:cpu-feature.node.kubevirt.io/arch-capabilities": {},
                        "f:cpu-feature.node.kubevirt.io/avx": {},
                        "f:cpu-feature.node.kubevirt.io/clflush": {},
                        "f:cpu-feature.node.kubevirt.io/cmov": {},
                        "f:cpu-feature.node.kubevirt.io/cx16": {},
                        "f:cpu-feature.node.kubevirt.io/cx8": {},
                        "f:cpu-feature.node.kubevirt.io/de": {},
                        "f:cpu-feature.node.kubevirt.io/erms": {},
                        "f:cpu-feature.node.kubevirt.io/f16c": {},
                        "f:cpu-feature.node.kubevirt.io/fpu": {},
                        "f:cpu-feature.node.kubevirt.io/fsgsbase": {},
                        "f:cpu-feature.node.kubevirt.io/fxsr": {},
                        "f:cpu-feature.node.kubevirt.io/hypervisor": {},
                        "f:cpu-feature.node.kubevirt.io/ibpb": {},
                        "f:cpu-feature.node.kubevirt.io/ibrs": {},
                        "f:cpu-feature.node.kubevirt.io/invtsc": {},
                        "f:cpu-feature.node.kubevirt.io/lahf_lm": {},
                        "f:cpu-feature.node.kubevirt.io/lm": {},
                        "f:cpu-feature.node.kubevirt.io/mca": {},
                        "f:cpu-feature.node.kubevirt.io/mce": {},
                        "f:cpu-feature.node.kubevirt.io/md-clear": {},
                        "f:cpu-feature.node.kubevirt.io/mmx": {},
                        "f:cpu-feature.node.kubevirt.io/msr": {},
                        "f:cpu-feature.node.kubevirt.io/mtrr": {},
                        "f:cpu-feature.node.kubevirt.io/nx": {},
                        "f:cpu-feature.node.kubevirt.io/pae": {},
                        "f:cpu-feature.node.kubevirt.io/pat": {},
                        "f:cpu-feature.node.kubevirt.io/pcid": {},
                        "f:cpu-feature.node.kubevirt.io/pclmuldq": {},
                        "f:cpu-feature.node.kubevirt.io/pdcm": {},
                        "f:cpu-feature.node.kubevirt.io/pge": {},
                        "f:cpu-feature.node.kubevirt.io/pni": {},
                        "f:cpu-feature.node.kubevirt.io/popcnt": {},
                        "f:cpu-feature.node.kubevirt.io/pschange-mc-no": {},
                        "f:cpu-feature.node.kubevirt.io/pse": {},
                        "f:cpu-feature.node.kubevirt.io/pse36": {},
                        "f:cpu-feature.node.kubevirt.io/rdrand": {},
                        "f:cpu-feature.node.kubevirt.io/rdtscp": {},
                        "f:cpu-feature.node.kubevirt.io/sep": {},
                        "f:cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:cpu-feature.node.kubevirt.io/smep": {},
                        "f:cpu-feature.node.kubevirt.io/spec-ctrl": {},
                        "f:cpu-feature.node.kubevirt.io/ss": {},
                        "f:cpu-feature.node.kubevirt.io/ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/sse": {},
                        "f:cpu-feature.node.kubevirt.io/sse2": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.1": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.2": {},
                        "f:cpu-feature.node.kubevirt.io/ssse3": {},
                        "f:cpu-feature.node.kubevirt.io/stibp": {},
                        "f:cpu-feature.node.kubevirt.io/syscall": {},
                        "f:cpu-feature.node.kubevirt.io/tsc": {},
                        "f:cpu-feature.node.kubevirt.io/tsc-deadline": {},
                        "f:cpu-feature.node.kubevirt.io/tsc_adjust": {},
                        "f:cpu-feature.node.kubevirt.io/umip": {},
                        "f:cpu-feature.node.kubevirt.io/vme": {},
                        "f:cpu-feature.node.kubevirt.io/vmx": {},
                        "f:cpu-feature.node.kubevirt.io/x2apic": {},
                        "f:cpu-feature.node.kubevirt.io/xsave": {},
                        "f:cpu-feature.node.kubevirt.io/xsaveopt": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model-migration.node.kubevirt.io/Penryn": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model.node.kubevirt.io/Penryn": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Westmere": {},
                        "f:cpu-model.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-frequency": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-scalable": {},
                        "f:cpu-vendor.node.kubevirt.io/Intel": {},
                        "f:cpumanager": {},
                        "f:host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/arat": {},
                        "f:host-model-required-features.node.kubevirt.io/arch-capabilities": {},
                        "f:host-model-required-features.node.kubevirt.io/hypervisor": {},
                        "f:host-model-required-features.node.kubevirt.io/ibpb": {},
                        "f:host-model-required-features.node.kubevirt.io/ibrs": {},
                        "f:host-model-required-features.node.kubevirt.io/invtsc": {},
                        "f:host-model-required-features.node.kubevirt.io/md-clear": {},
                        "f:host-model-required-features.node.kubevirt.io/pcid": {},
                        "f:host-model-required-features.node.kubevirt.io/pdcm": {},
                        "f:host-model-required-features.node.kubevirt.io/pschange-mc-no": {},
                        "f:host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:host-model-required-features.node.kubevirt.io/ss": {},
                        "f:host-model-required-features.node.kubevirt.io/ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/tsc_adjust": {},
                        "f:host-model-required-features.node.kubevirt.io/umip": {},
                        "f:host-model-required-features.node.kubevirt.io/vmx": {},
                        "f:host-model-required-features.node.kubevirt.io/xsaveopt": {},
                        "f:hyperv.node.kubevirt.io/base": {},
                        "f:hyperv.node.kubevirt.io/frequencies": {},
                        "f:hyperv.node.kubevirt.io/ipi": {},
                        "f:hyperv.node.kubevirt.io/reenlightenment": {},
                        "f:hyperv.node.kubevirt.io/reset": {},
                        "f:hyperv.node.kubevirt.io/runtime": {},
                        "f:hyperv.node.kubevirt.io/synic": {},
                        "f:hyperv.node.kubevirt.io/synic2": {},
                        "f:hyperv.node.kubevirt.io/synictimer": {},
                        "f:hyperv.node.kubevirt.io/time": {},
                        "f:hyperv.node.kubevirt.io/tlbflush": {},
                        "f:hyperv.node.kubevirt.io/vpindex": {},
                        "f:kubevirt.io/schedulable": {},
                        "f:scheduling.node.kubevirt.io/tsc-frequency-2294785000": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "podCIDR": "10.244.1.0/24",
              "podCIDRs": [
                "10.244.1.0/24"
              ]
            },
            "status": {
              "capacity": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "959218776Ki",
                "hugepages-2Mi": "0",
                "memory": "16289020Ki",
                "pods": "110"
              },
              "allocatable": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "884016022498",
                "hugepages-2Mi": "0",
                "memory": "16186620Ki",
                "pods": "110"
              },
              "conditions": [],
              "addresses": [],
              "daemonEndpoints": {
                "kubeletEndpoint": {
                  "Port": 10250
                }
              },
              "nodeInfo": {
                "machineID": "c9a42bf422734357bcd8830fbd9ab589",
                "systemUUID": "31b18139-7beb-e151-b877-81c6fda2d168",
                "bootID": "cb4d0838-5e19-467c-a397-18806415782c",
                "kernelVersion": "5.15.0-58-generic",
                "osImage": "Linux",
                "containerRuntimeVersion": "containerd://1.5.9",
                "kubeletVersion": "v1.24.6",
                "kubeProxyVersion": "v1.24.6",
                "operatingSystem": "linux",
                "architecture": "amd64"
              },
              "images": []
            }
          },
          {
            "metadata": {
              "name": "node03",
              "uid": "33edaa4f-1289-4588-864d-b2b692861675",
              "resourceVersion": "65954455",
              "creationTimestamp": "2022-10-11T19:51:20Z",
              "labels": {
                "beta.kubernetes.io/arch": "amd64",
                "beta.kubernetes.io/os": "linux",
                "cpu-feature.node.kubevirt.io/aes": "true",
                "cpu-feature.node.kubevirt.io/amd-ssbd": "true",
                "cpu-feature.node.kubevirt.io/amd-stibp": "true",
                "cpu-feature.node.kubevirt.io/apic": "true",
                "cpu-feature.node.kubevirt.io/arat": "true",
                "cpu-feature.node.kubevirt.io/arch-capabilities": "true",
                "cpu-feature.node.kubevirt.io/avx": "true",
                "cpu-feature.node.kubevirt.io/clflush": "true",
                "cpu-feature.node.kubevirt.io/cmov": "true",
                "cpu-feature.node.kubevirt.io/cx16": "true",
                "cpu-feature.node.kubevirt.io/cx8": "true",
                "cpu-feature.node.kubevirt.io/de": "true",
                "cpu-feature.node.kubevirt.io/erms": "true",
                "cpu-feature.node.kubevirt.io/f16c": "true",
                "cpu-feature.node.kubevirt.io/fpu": "true",
                "cpu-feature.node.kubevirt.io/fsgsbase": "true",
                "cpu-feature.node.kubevirt.io/fxsr": "true",
                "cpu-feature.node.kubevirt.io/hypervisor": "true",
                "cpu-feature.node.kubevirt.io/ibpb": "true",
                "cpu-feature.node.kubevirt.io/ibrs": "true",
                "cpu-feature.node.kubevirt.io/invtsc": "true",
                "cpu-feature.node.kubevirt.io/lahf_lm": "true",
                "cpu-feature.node.kubevirt.io/lm": "true",
                "cpu-feature.node.kubevirt.io/mca": "true",
                "cpu-feature.node.kubevirt.io/mce": "true",
                "cpu-feature.node.kubevirt.io/md-clear": "true",
                "cpu-feature.node.kubevirt.io/mmx": "true",
                "cpu-feature.node.kubevirt.io/msr": "true",
                "cpu-feature.node.kubevirt.io/mtrr": "true",
                "cpu-feature.node.kubevirt.io/nx": "true",
                "cpu-feature.node.kubevirt.io/pae": "true",
                "cpu-feature.node.kubevirt.io/pat": "true",
                "cpu-feature.node.kubevirt.io/pcid": "true",
                "cpu-feature.node.kubevirt.io/pclmuldq": "true",
                "cpu-feature.node.kubevirt.io/pdcm": "true",
                "cpu-feature.node.kubevirt.io/pge": "true",
                "cpu-feature.node.kubevirt.io/pni": "true",
                "cpu-feature.node.kubevirt.io/popcnt": "true",
                "cpu-feature.node.kubevirt.io/pschange-mc-no": "true",
                "cpu-feature.node.kubevirt.io/pse": "true",
                "cpu-feature.node.kubevirt.io/pse36": "true",
                "cpu-feature.node.kubevirt.io/rdrand": "true",
                "cpu-feature.node.kubevirt.io/rdtscp": "true",
                "cpu-feature.node.kubevirt.io/sep": "true",
                "cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "cpu-feature.node.kubevirt.io/smep": "true",
                "cpu-feature.node.kubevirt.io/spec-ctrl": "true",
                "cpu-feature.node.kubevirt.io/ss": "true",
                "cpu-feature.node.kubevirt.io/ssbd": "true",
                "cpu-feature.node.kubevirt.io/sse": "true",
                "cpu-feature.node.kubevirt.io/sse2": "true",
                "cpu-feature.node.kubevirt.io/sse4.1": "true",
                "cpu-feature.node.kubevirt.io/sse4.2": "true",
                "cpu-feature.node.kubevirt.io/ssse3": "true",
                "cpu-feature.node.kubevirt.io/stibp": "true",
                "cpu-feature.node.kubevirt.io/syscall": "true",
                "cpu-feature.node.kubevirt.io/tsc": "true",
                "cpu-feature.node.kubevirt.io/tsc-deadline": "true",
                "cpu-feature.node.kubevirt.io/tsc_adjust": "true",
                "cpu-feature.node.kubevirt.io/umip": "true",
                "cpu-feature.node.kubevirt.io/vme": "true",
                "cpu-feature.node.kubevirt.io/vmx": "true",
                "cpu-feature.node.kubevirt.io/x2apic": "true",
                "cpu-feature.node.kubevirt.io/xsave": "true",
                "cpu-feature.node.kubevirt.io/xsaveopt": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model-migration.node.kubevirt.io/Penryn": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-model.node.kubevirt.io/IvyBridge": "true",
                "cpu-model.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Nehalem": "true",
                "cpu-model.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model.node.kubevirt.io/Penryn": "true",
                "cpu-model.node.kubevirt.io/SandyBridge": "true",
                "cpu-model.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Westmere": "true",
                "cpu-model.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-timer.node.kubevirt.io/tsc-frequency": "2294773000",
                "cpu-timer.node.kubevirt.io/tsc-scalable": "false",
                "cpu-vendor.node.kubevirt.io/Intel": "true",
                "cpumanager": "false",
                "disk-type": "hdd",
                "host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": "true",
                "host-model-required-features.node.kubevirt.io/amd-ssbd": "true",
                "host-model-required-features.node.kubevirt.io/amd-stibp": "true",
                "host-model-required-features.node.kubevirt.io/arat": "true",
                "host-model-required-features.node.kubevirt.io/arch-capabilities": "true",
                "host-model-required-features.node.kubevirt.io/hypervisor": "true",
                "host-model-required-features.node.kubevirt.io/ibpb": "true",
                "host-model-required-features.node.kubevirt.io/ibrs": "true",
                "host-model-required-features.node.kubevirt.io/invtsc": "true",
                "host-model-required-features.node.kubevirt.io/md-clear": "true",
                "host-model-required-features.node.kubevirt.io/pcid": "true",
                "host-model-required-features.node.kubevirt.io/pdcm": "true",
                "host-model-required-features.node.kubevirt.io/pschange-mc-no": "true",
                "host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "host-model-required-features.node.kubevirt.io/ss": "true",
                "host-model-required-features.node.kubevirt.io/ssbd": "true",
                "host-model-required-features.node.kubevirt.io/stibp": "true",
                "host-model-required-features.node.kubevirt.io/tsc_adjust": "true",
                "host-model-required-features.node.kubevirt.io/umip": "true",
                "host-model-required-features.node.kubevirt.io/vmx": "true",
                "host-model-required-features.node.kubevirt.io/xsaveopt": "true",
                "hyperv.node.kubevirt.io/base": "true",
                "hyperv.node.kubevirt.io/frequencies": "true",
                "hyperv.node.kubevirt.io/ipi": "true",
                "hyperv.node.kubevirt.io/reenlightenment": "true",
                "hyperv.node.kubevirt.io/reset": "true",
                "hyperv.node.kubevirt.io/runtime": "true",
                "hyperv.node.kubevirt.io/synic": "true",
                "hyperv.node.kubevirt.io/synic2": "true",
                "hyperv.node.kubevirt.io/synictimer": "true",
                "hyperv.node.kubevirt.io/time": "true",
                "hyperv.node.kubevirt.io/tlbflush": "true",
                "hyperv.node.kubevirt.io/vpindex": "true",
                "kubernetes.io/arch": "amd64",
                "kubernetes.io/hostname": "node03",
                "kubernetes.io/os": "linux",
                "kubevirt.io/schedulable": "true",
                "scheduling.node.kubevirt.io/tsc-frequency-2294773000": "true",
                "topology.hostpath.csi/node": "node03"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:20Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:volumes.kubernetes.io/controller-managed-attach-detach": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:beta.kubernetes.io/arch": {},
                        "f:beta.kubernetes.io/os": {},
                        "f:kubernetes.io/arch": {},
                        "f:kubernetes.io/hostname": {},
                        "f:kubernetes.io/os": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubeadm",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:24Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubeadm.alpha.kubernetes.io/cri-socket": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-operator-generic",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T20:12:51Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:status": {
                      "f:conditions": {
                        "k:{\"type\":\"NetworkUnavailable\"}": {
                          ".": {},
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {},
                          "f:type": {}
                        }
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kubectl-label",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-12T00:00:29Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        "f:disk-type": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-agent",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-25T18:17:34Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:io.cilium.network.ipv4-cilium-host": {},
                        "f:io.cilium.network.ipv4-health-ip": {},
                        "f:io.cilium.network.ipv4-pod-cidr": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-12-23T21:18:06Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:csi.volume.kubernetes.io/nodeid": {}
                      },
                      "f:labels": {
                        "f:topology.hostpath.csi/node": {}
                      }
                    },
                    "f:status": {
                      "f:addresses": {
                        "k:{\"type\":\"InternalIP\"}": {
                          "f:address": {}
                        }
                      },
                      "f:allocatable": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:ephemeral-storage": {},
                        "f:memory": {}
                      },
                      "f:capacity": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:ephemeral-storage": {},
                        "f:memory": {}
                      },
                      "f:conditions": {
                        "k:{\"type\":\"DiskPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"MemoryPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"PIDPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"Ready\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        }
                      },
                      "f:images": {},
                      "f:nodeInfo": {
                        "f:bootID": {},
                        "f:containerRuntimeVersion": {},
                        "f:kernelVersion": {}
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kube-controller-manager",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:06:15Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:node.alpha.kubernetes.io/ttl": {}
                      }
                    },
                    "f:spec": {
                      "f:podCIDR": {},
                      "f:podCIDRs": {
                        ".": {},
                        "v:\"10.244.2.0/24\"": {}
                      }
                    }
                  }
                },
                {
                  "manager": "Go-http-client",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:09:05Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubevirt.io/heartbeat": {}
                      },
                      "f:labels": {
                        "f:cpu-feature.node.kubevirt.io/aes": {},
                        "f:cpu-feature.node.kubevirt.io/amd-ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/amd-stibp": {},
                        "f:cpu-feature.node.kubevirt.io/apic": {},
                        "f:cpu-feature.node.kubevirt.io/arat": {},
                        "f:cpu-feature.node.kubevirt.io/arch-capabilities": {},
                        "f:cpu-feature.node.kubevirt.io/avx": {},
                        "f:cpu-feature.node.kubevirt.io/clflush": {},
                        "f:cpu-feature.node.kubevirt.io/cmov": {},
                        "f:cpu-feature.node.kubevirt.io/cx16": {},
                        "f:cpu-feature.node.kubevirt.io/cx8": {},
                        "f:cpu-feature.node.kubevirt.io/de": {},
                        "f:cpu-feature.node.kubevirt.io/erms": {},
                        "f:cpu-feature.node.kubevirt.io/f16c": {},
                        "f:cpu-feature.node.kubevirt.io/fpu": {},
                        "f:cpu-feature.node.kubevirt.io/fsgsbase": {},
                        "f:cpu-feature.node.kubevirt.io/fxsr": {},
                        "f:cpu-feature.node.kubevirt.io/hypervisor": {},
                        "f:cpu-feature.node.kubevirt.io/ibpb": {},
                        "f:cpu-feature.node.kubevirt.io/ibrs": {},
                        "f:cpu-feature.node.kubevirt.io/invtsc": {},
                        "f:cpu-feature.node.kubevirt.io/lahf_lm": {},
                        "f:cpu-feature.node.kubevirt.io/lm": {},
                        "f:cpu-feature.node.kubevirt.io/mca": {},
                        "f:cpu-feature.node.kubevirt.io/mce": {},
                        "f:cpu-feature.node.kubevirt.io/md-clear": {},
                        "f:cpu-feature.node.kubevirt.io/mmx": {},
                        "f:cpu-feature.node.kubevirt.io/msr": {},
                        "f:cpu-feature.node.kubevirt.io/mtrr": {},
                        "f:cpu-feature.node.kubevirt.io/nx": {},
                        "f:cpu-feature.node.kubevirt.io/pae": {},
                        "f:cpu-feature.node.kubevirt.io/pat": {},
                        "f:cpu-feature.node.kubevirt.io/pcid": {},
                        "f:cpu-feature.node.kubevirt.io/pclmuldq": {},
                        "f:cpu-feature.node.kubevirt.io/pdcm": {},
                        "f:cpu-feature.node.kubevirt.io/pge": {},
                        "f:cpu-feature.node.kubevirt.io/pni": {},
                        "f:cpu-feature.node.kubevirt.io/popcnt": {},
                        "f:cpu-feature.node.kubevirt.io/pschange-mc-no": {},
                        "f:cpu-feature.node.kubevirt.io/pse": {},
                        "f:cpu-feature.node.kubevirt.io/pse36": {},
                        "f:cpu-feature.node.kubevirt.io/rdrand": {},
                        "f:cpu-feature.node.kubevirt.io/rdtscp": {},
                        "f:cpu-feature.node.kubevirt.io/sep": {},
                        "f:cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:cpu-feature.node.kubevirt.io/smep": {},
                        "f:cpu-feature.node.kubevirt.io/spec-ctrl": {},
                        "f:cpu-feature.node.kubevirt.io/ss": {},
                        "f:cpu-feature.node.kubevirt.io/ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/sse": {},
                        "f:cpu-feature.node.kubevirt.io/sse2": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.1": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.2": {},
                        "f:cpu-feature.node.kubevirt.io/ssse3": {},
                        "f:cpu-feature.node.kubevirt.io/stibp": {},
                        "f:cpu-feature.node.kubevirt.io/syscall": {},
                        "f:cpu-feature.node.kubevirt.io/tsc": {},
                        "f:cpu-feature.node.kubevirt.io/tsc-deadline": {},
                        "f:cpu-feature.node.kubevirt.io/tsc_adjust": {},
                        "f:cpu-feature.node.kubevirt.io/umip": {},
                        "f:cpu-feature.node.kubevirt.io/vme": {},
                        "f:cpu-feature.node.kubevirt.io/vmx": {},
                        "f:cpu-feature.node.kubevirt.io/x2apic": {},
                        "f:cpu-feature.node.kubevirt.io/xsave": {},
                        "f:cpu-feature.node.kubevirt.io/xsaveopt": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model-migration.node.kubevirt.io/Penryn": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model.node.kubevirt.io/Penryn": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Westmere": {},
                        "f:cpu-model.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-frequency": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-scalable": {},
                        "f:cpu-vendor.node.kubevirt.io/Intel": {},
                        "f:cpumanager": {},
                        "f:host-model-cpu.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/arat": {},
                        "f:host-model-required-features.node.kubevirt.io/arch-capabilities": {},
                        "f:host-model-required-features.node.kubevirt.io/hypervisor": {},
                        "f:host-model-required-features.node.kubevirt.io/ibpb": {},
                        "f:host-model-required-features.node.kubevirt.io/ibrs": {},
                        "f:host-model-required-features.node.kubevirt.io/invtsc": {},
                        "f:host-model-required-features.node.kubevirt.io/md-clear": {},
                        "f:host-model-required-features.node.kubevirt.io/pcid": {},
                        "f:host-model-required-features.node.kubevirt.io/pdcm": {},
                        "f:host-model-required-features.node.kubevirt.io/pschange-mc-no": {},
                        "f:host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:host-model-required-features.node.kubevirt.io/ss": {},
                        "f:host-model-required-features.node.kubevirt.io/ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/tsc_adjust": {},
                        "f:host-model-required-features.node.kubevirt.io/umip": {},
                        "f:host-model-required-features.node.kubevirt.io/vmx": {},
                        "f:host-model-required-features.node.kubevirt.io/xsaveopt": {},
                        "f:hyperv.node.kubevirt.io/base": {},
                        "f:hyperv.node.kubevirt.io/frequencies": {},
                        "f:hyperv.node.kubevirt.io/ipi": {},
                        "f:hyperv.node.kubevirt.io/reenlightenment": {},
                        "f:hyperv.node.kubevirt.io/reset": {},
                        "f:hyperv.node.kubevirt.io/runtime": {},
                        "f:hyperv.node.kubevirt.io/synic": {},
                        "f:hyperv.node.kubevirt.io/synic2": {},
                        "f:hyperv.node.kubevirt.io/synictimer": {},
                        "f:hyperv.node.kubevirt.io/time": {},
                        "f:hyperv.node.kubevirt.io/tlbflush": {},
                        "f:hyperv.node.kubevirt.io/vpindex": {},
                        "f:kubevirt.io/schedulable": {},
                        "f:scheduling.node.kubevirt.io/tsc-frequency-2294773000": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "podCIDR": "10.244.2.0/24",
              "podCIDRs": [
                "10.244.2.0/24"
              ]
            },
            "status": {
              "capacity": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "959218776Ki",
                "hugepages-2Mi": "0",
                "memory": "16289020Ki",
                "pods": "110"
              },
              "allocatable": {
                "cpu": "8",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "884016022498",
                "hugepages-2Mi": "0",
                "memory": "16186620Ki",
                "pods": "110"
              },
              "conditions": [],
              "addresses": [],
              "daemonEndpoints": {
                "kubeletEndpoint": {
                  "Port": 10250
                }
              },
              "nodeInfo": {
                "machineID": "4119bf246539425ea85bf16b91753c70",
                "systemUUID": "1565589e-4700-a658-bc97-3056cd0d6ea8",
                "bootID": "d75e1326-9f53-4cf6-9cab-eac1d46f325d",
                "kernelVersion": "5.15.0-58-generic",
                "osImage": "Linux",
                "containerRuntimeVersion": "containerd://1.5.9",
                "kubeletVersion": "v1.24.6",
                "kubeProxyVersion": "v1.24.6",
                "operatingSystem": "linux",
                "architecture": "amd64"
              },
              "images": []
            }
          },
          {
            "metadata": {
              "name": "node04",
              "uid": "9a8fd8c3-64e1-412d-a153-a03ab734f8aa",
              "resourceVersion": "65954550",
              "creationTimestamp": "2022-10-11T19:51:30Z",
              "labels": {
                "beta.kubernetes.io/arch": "amd64",
                "beta.kubernetes.io/os": "linux",
                "cpu-feature.node.kubevirt.io/3dnowprefetch": "true",
                "cpu-feature.node.kubevirt.io/abm": "true",
                "cpu-feature.node.kubevirt.io/adx": "true",
                "cpu-feature.node.kubevirt.io/aes": "true",
                "cpu-feature.node.kubevirt.io/amd-ssbd": "true",
                "cpu-feature.node.kubevirt.io/amd-stibp": "true",
                "cpu-feature.node.kubevirt.io/apic": "true",
                "cpu-feature.node.kubevirt.io/arat": "true",
                "cpu-feature.node.kubevirt.io/arch-capabilities": "true",
                "cpu-feature.node.kubevirt.io/avx": "true",
                "cpu-feature.node.kubevirt.io/avx2": "true",
                "cpu-feature.node.kubevirt.io/bmi1": "true",
                "cpu-feature.node.kubevirt.io/bmi2": "true",
                "cpu-feature.node.kubevirt.io/clflush": "true",
                "cpu-feature.node.kubevirt.io/clflushopt": "true",
                "cpu-feature.node.kubevirt.io/cmov": "true",
                "cpu-feature.node.kubevirt.io/cx16": "true",
                "cpu-feature.node.kubevirt.io/cx8": "true",
                "cpu-feature.node.kubevirt.io/de": "true",
                "cpu-feature.node.kubevirt.io/erms": "true",
                "cpu-feature.node.kubevirt.io/f16c": "true",
                "cpu-feature.node.kubevirt.io/fma": "true",
                "cpu-feature.node.kubevirt.io/fpu": "true",
                "cpu-feature.node.kubevirt.io/fsgsbase": "true",
                "cpu-feature.node.kubevirt.io/fxsr": "true",
                "cpu-feature.node.kubevirt.io/hypervisor": "true",
                "cpu-feature.node.kubevirt.io/ibpb": "true",
                "cpu-feature.node.kubevirt.io/ibrs": "true",
                "cpu-feature.node.kubevirt.io/ibrs-all": "true",
                "cpu-feature.node.kubevirt.io/invpcid": "true",
                "cpu-feature.node.kubevirt.io/invtsc": "true",
                "cpu-feature.node.kubevirt.io/lahf_lm": "true",
                "cpu-feature.node.kubevirt.io/lm": "true",
                "cpu-feature.node.kubevirt.io/mca": "true",
                "cpu-feature.node.kubevirt.io/mce": "true",
                "cpu-feature.node.kubevirt.io/md-clear": "true",
                "cpu-feature.node.kubevirt.io/mds-no": "true",
                "cpu-feature.node.kubevirt.io/mmx": "true",
                "cpu-feature.node.kubevirt.io/movbe": "true",
                "cpu-feature.node.kubevirt.io/mpx": "true",
                "cpu-feature.node.kubevirt.io/msr": "true",
                "cpu-feature.node.kubevirt.io/mtrr": "true",
                "cpu-feature.node.kubevirt.io/nx": "true",
                "cpu-feature.node.kubevirt.io/pae": "true",
                "cpu-feature.node.kubevirt.io/pat": "true",
                "cpu-feature.node.kubevirt.io/pcid": "true",
                "cpu-feature.node.kubevirt.io/pclmuldq": "true",
                "cpu-feature.node.kubevirt.io/pdcm": "true",
                "cpu-feature.node.kubevirt.io/pdpe1gb": "true",
                "cpu-feature.node.kubevirt.io/pge": "true",
                "cpu-feature.node.kubevirt.io/pku": "true",
                "cpu-feature.node.kubevirt.io/pni": "true",
                "cpu-feature.node.kubevirt.io/popcnt": "true",
                "cpu-feature.node.kubevirt.io/pschange-mc-no": "true",
                "cpu-feature.node.kubevirt.io/pse": "true",
                "cpu-feature.node.kubevirt.io/pse36": "true",
                "cpu-feature.node.kubevirt.io/rdctl-no": "true",
                "cpu-feature.node.kubevirt.io/rdrand": "true",
                "cpu-feature.node.kubevirt.io/rdseed": "true",
                "cpu-feature.node.kubevirt.io/rdtscp": "true",
                "cpu-feature.node.kubevirt.io/sep": "true",
                "cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": "true",
                "cpu-feature.node.kubevirt.io/smap": "true",
                "cpu-feature.node.kubevirt.io/smep": "true",
                "cpu-feature.node.kubevirt.io/spec-ctrl": "true",
                "cpu-feature.node.kubevirt.io/ss": "true",
                "cpu-feature.node.kubevirt.io/ssbd": "true",
                "cpu-feature.node.kubevirt.io/sse": "true",
                "cpu-feature.node.kubevirt.io/sse2": "true",
                "cpu-feature.node.kubevirt.io/sse4.1": "true",
                "cpu-feature.node.kubevirt.io/sse4.2": "true",
                "cpu-feature.node.kubevirt.io/ssse3": "true",
                "cpu-feature.node.kubevirt.io/stibp": "true",
                "cpu-feature.node.kubevirt.io/syscall": "true",
                "cpu-feature.node.kubevirt.io/tsc": "true",
                "cpu-feature.node.kubevirt.io/tsc-deadline": "true",
                "cpu-feature.node.kubevirt.io/tsc_adjust": "true",
                "cpu-feature.node.kubevirt.io/umip": "true",
                "cpu-feature.node.kubevirt.io/vme": "true",
                "cpu-feature.node.kubevirt.io/vmx": "true",
                "cpu-feature.node.kubevirt.io/x2apic": "true",
                "cpu-feature.node.kubevirt.io/xgetbv1": "true",
                "cpu-feature.node.kubevirt.io/xsave": "true",
                "cpu-feature.node.kubevirt.io/xsavec": "true",
                "cpu-feature.node.kubevirt.io/xsaveopt": "true",
                "cpu-feature.node.kubevirt.io/xsaves": "true",
                "cpu-model-migration.node.kubevirt.io/Broadwell-noTSX": "true",
                "cpu-model-migration.node.kubevirt.io/Broadwell-noTSX-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Cooperlake": "true",
                "cpu-model-migration.node.kubevirt.io/Haswell-noTSX": "true",
                "cpu-model-migration.node.kubevirt.io/Haswell-noTSX-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem": "true",
                "cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model-migration.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model-migration.node.kubevirt.io/Penryn": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge": "true",
                "cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Skylake-Client-noTSX-IBRS": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere": "true",
                "cpu-model-migration.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-model.node.kubevirt.io/Broadwell-noTSX": "true",
                "cpu-model.node.kubevirt.io/Broadwell-noTSX-IBRS": "true",
                "cpu-model.node.kubevirt.io/Haswell-noTSX": "true",
                "cpu-model.node.kubevirt.io/Haswell-noTSX-IBRS": "true",
                "cpu-model.node.kubevirt.io/IvyBridge": "true",
                "cpu-model.node.kubevirt.io/IvyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Nehalem": "true",
                "cpu-model.node.kubevirt.io/Nehalem-IBRS": "true",
                "cpu-model.node.kubevirt.io/Opteron_G1": "true",
                "cpu-model.node.kubevirt.io/Opteron_G2": "true",
                "cpu-model.node.kubevirt.io/Penryn": "true",
                "cpu-model.node.kubevirt.io/SandyBridge": "true",
                "cpu-model.node.kubevirt.io/SandyBridge-IBRS": "true",
                "cpu-model.node.kubevirt.io/Skylake-Client-noTSX-IBRS": "true",
                "cpu-model.node.kubevirt.io/Westmere": "true",
                "cpu-model.node.kubevirt.io/Westmere-IBRS": "true",
                "cpu-timer.node.kubevirt.io/tsc-frequency": "1991999000",
                "cpu-timer.node.kubevirt.io/tsc-scalable": "false",
                "cpu-vendor.node.kubevirt.io/Intel": "true",
                "cpumanager": "false",
                "disk-type": "ssd",
                "host-model-cpu.node.kubevirt.io/Cooperlake": "true",
                "host-model-required-features.node.kubevirt.io/amd-ssbd": "true",
                "host-model-required-features.node.kubevirt.io/amd-stibp": "true",
                "host-model-required-features.node.kubevirt.io/hypervisor": "true",
                "host-model-required-features.node.kubevirt.io/ibpb": "true",
                "host-model-required-features.node.kubevirt.io/ibrs": "true",
                "host-model-required-features.node.kubevirt.io/invtsc": "true",
                "host-model-required-features.node.kubevirt.io/md-clear": "true",
                "host-model-required-features.node.kubevirt.io/mpx": "true",
                "host-model-required-features.node.kubevirt.io/pdcm": "true",
                "host-model-required-features.node.kubevirt.io/ss": "true",
                "host-model-required-features.node.kubevirt.io/tsc_adjust": "true",
                "host-model-required-features.node.kubevirt.io/umip": "true",
                "host-model-required-features.node.kubevirt.io/vmx": "true",
                "host-model-required-features.node.kubevirt.io/xsaves": "true",
                "hyperv.node.kubevirt.io/base": "true",
                "hyperv.node.kubevirt.io/frequencies": "true",
                "hyperv.node.kubevirt.io/ipi": "true",
                "hyperv.node.kubevirt.io/reenlightenment": "true",
                "hyperv.node.kubevirt.io/reset": "true",
                "hyperv.node.kubevirt.io/runtime": "true",
                "hyperv.node.kubevirt.io/synic": "true",
                "hyperv.node.kubevirt.io/synic2": "true",
                "hyperv.node.kubevirt.io/synictimer": "true",
                "hyperv.node.kubevirt.io/time": "true",
                "hyperv.node.kubevirt.io/tlbflush": "true",
                "hyperv.node.kubevirt.io/vpindex": "true",
                "kubernetes.io/arch": "amd64",
                "kubernetes.io/hostname": "node04",
                "kubernetes.io/os": "linux",
                "kubevirt.io/schedulable": "true",
                "scheduling.node.kubevirt.io/tsc-frequency-1991999000": "true",
                "topology.hostpath.csi/node": "node04"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:30Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:volumes.kubernetes.io/controller-managed-attach-detach": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:beta.kubernetes.io/arch": {},
                        "f:beta.kubernetes.io/os": {},
                        "f:kubernetes.io/arch": {},
                        "f:kubernetes.io/hostname": {},
                        "f:kubernetes.io/os": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubeadm",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:51:35Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubeadm.alpha.kubernetes.io/cri-socket": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-operator-generic",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T20:12:35Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:status": {
                      "f:conditions": {
                        "k:{\"type\":\"NetworkUnavailable\"}": {
                          ".": {},
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {},
                          "f:type": {}
                        }
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kubectl-label",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-12T00:00:18Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        "f:disk-type": {}
                      }
                    }
                  }
                },
                {
                  "manager": "cilium-agent",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-25T18:18:08Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:io.cilium.network.ipv4-cilium-host": {},
                        "f:io.cilium.network.ipv4-health-ip": {},
                        "f:io.cilium.network.ipv4-pod-cidr": {}
                      }
                    }
                  }
                },
                {
                  "manager": "kubelet",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-12-23T21:08:22Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:csi.volume.kubernetes.io/nodeid": {}
                      },
                      "f:labels": {
                        "f:topology.hostpath.csi/node": {}
                      }
                    },
                    "f:status": {
                      "f:addresses": {
                        "k:{\"type\":\"InternalIP\"}": {
                          "f:address": {}
                        }
                      },
                      "f:allocatable": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:ephemeral-storage": {},
                        "f:memory": {}
                      },
                      "f:capacity": {
                        "f:devices.kubevirt.io/kvm": {},
                        "f:devices.kubevirt.io/tun": {},
                        "f:devices.kubevirt.io/vhost-net": {},
                        "f:memory": {}
                      },
                      "f:conditions": {
                        "k:{\"type\":\"DiskPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"MemoryPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"PIDPressure\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        },
                        "k:{\"type\":\"Ready\"}": {
                          "f:lastHeartbeatTime": {},
                          "f:lastTransitionTime": {},
                          "f:message": {},
                          "f:reason": {},
                          "f:status": {}
                        }
                      },
                      "f:images": {},
                      "f:nodeInfo": {
                        "f:bootID": {},
                        "f:containerRuntimeVersion": {},
                        "f:kernelVersion": {}
                      }
                    }
                  },
                  "subresource": "status"
                },
                {
                  "manager": "kube-controller-manager",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-17T20:57:40Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:node.alpha.kubernetes.io/ttl": {}
                      }
                    },
                    "f:spec": {
                      "f:podCIDR": {},
                      "f:podCIDRs": {
                        ".": {},
                        "v:\"10.244.3.0/24\"": {}
                      }
                    }
                  }
                },
                {
                  "manager": "Go-http-client",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-21T20:08:34Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        "f:kubevirt.io/heartbeat": {}
                      },
                      "f:labels": {
                        "f:cpu-feature.node.kubevirt.io/3dnowprefetch": {},
                        "f:cpu-feature.node.kubevirt.io/abm": {},
                        "f:cpu-feature.node.kubevirt.io/adx": {},
                        "f:cpu-feature.node.kubevirt.io/aes": {},
                        "f:cpu-feature.node.kubevirt.io/amd-ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/amd-stibp": {},
                        "f:cpu-feature.node.kubevirt.io/apic": {},
                        "f:cpu-feature.node.kubevirt.io/arat": {},
                        "f:cpu-feature.node.kubevirt.io/arch-capabilities": {},
                        "f:cpu-feature.node.kubevirt.io/avx": {},
                        "f:cpu-feature.node.kubevirt.io/avx2": {},
                        "f:cpu-feature.node.kubevirt.io/bmi1": {},
                        "f:cpu-feature.node.kubevirt.io/bmi2": {},
                        "f:cpu-feature.node.kubevirt.io/clflush": {},
                        "f:cpu-feature.node.kubevirt.io/clflushopt": {},
                        "f:cpu-feature.node.kubevirt.io/cmov": {},
                        "f:cpu-feature.node.kubevirt.io/cx16": {},
                        "f:cpu-feature.node.kubevirt.io/cx8": {},
                        "f:cpu-feature.node.kubevirt.io/de": {},
                        "f:cpu-feature.node.kubevirt.io/erms": {},
                        "f:cpu-feature.node.kubevirt.io/f16c": {},
                        "f:cpu-feature.node.kubevirt.io/fma": {},
                        "f:cpu-feature.node.kubevirt.io/fpu": {},
                        "f:cpu-feature.node.kubevirt.io/fsgsbase": {},
                        "f:cpu-feature.node.kubevirt.io/fxsr": {},
                        "f:cpu-feature.node.kubevirt.io/hypervisor": {},
                        "f:cpu-feature.node.kubevirt.io/ibpb": {},
                        "f:cpu-feature.node.kubevirt.io/ibrs": {},
                        "f:cpu-feature.node.kubevirt.io/ibrs-all": {},
                        "f:cpu-feature.node.kubevirt.io/invpcid": {},
                        "f:cpu-feature.node.kubevirt.io/invtsc": {},
                        "f:cpu-feature.node.kubevirt.io/lahf_lm": {},
                        "f:cpu-feature.node.kubevirt.io/lm": {},
                        "f:cpu-feature.node.kubevirt.io/mca": {},
                        "f:cpu-feature.node.kubevirt.io/mce": {},
                        "f:cpu-feature.node.kubevirt.io/md-clear": {},
                        "f:cpu-feature.node.kubevirt.io/mds-no": {},
                        "f:cpu-feature.node.kubevirt.io/mmx": {},
                        "f:cpu-feature.node.kubevirt.io/movbe": {},
                        "f:cpu-feature.node.kubevirt.io/mpx": {},
                        "f:cpu-feature.node.kubevirt.io/msr": {},
                        "f:cpu-feature.node.kubevirt.io/mtrr": {},
                        "f:cpu-feature.node.kubevirt.io/nx": {},
                        "f:cpu-feature.node.kubevirt.io/pae": {},
                        "f:cpu-feature.node.kubevirt.io/pat": {},
                        "f:cpu-feature.node.kubevirt.io/pcid": {},
                        "f:cpu-feature.node.kubevirt.io/pclmuldq": {},
                        "f:cpu-feature.node.kubevirt.io/pdcm": {},
                        "f:cpu-feature.node.kubevirt.io/pdpe1gb": {},
                        "f:cpu-feature.node.kubevirt.io/pge": {},
                        "f:cpu-feature.node.kubevirt.io/pku": {},
                        "f:cpu-feature.node.kubevirt.io/pni": {},
                        "f:cpu-feature.node.kubevirt.io/popcnt": {},
                        "f:cpu-feature.node.kubevirt.io/pschange-mc-no": {},
                        "f:cpu-feature.node.kubevirt.io/pse": {},
                        "f:cpu-feature.node.kubevirt.io/pse36": {},
                        "f:cpu-feature.node.kubevirt.io/rdctl-no": {},
                        "f:cpu-feature.node.kubevirt.io/rdrand": {},
                        "f:cpu-feature.node.kubevirt.io/rdseed": {},
                        "f:cpu-feature.node.kubevirt.io/rdtscp": {},
                        "f:cpu-feature.node.kubevirt.io/sep": {},
                        "f:cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": {},
                        "f:cpu-feature.node.kubevirt.io/smap": {},
                        "f:cpu-feature.node.kubevirt.io/smep": {},
                        "f:cpu-feature.node.kubevirt.io/spec-ctrl": {},
                        "f:cpu-feature.node.kubevirt.io/ss": {},
                        "f:cpu-feature.node.kubevirt.io/ssbd": {},
                        "f:cpu-feature.node.kubevirt.io/sse": {},
                        "f:cpu-feature.node.kubevirt.io/sse2": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.1": {},
                        "f:cpu-feature.node.kubevirt.io/sse4.2": {},
                        "f:cpu-feature.node.kubevirt.io/ssse3": {},
                        "f:cpu-feature.node.kubevirt.io/stibp": {},
                        "f:cpu-feature.node.kubevirt.io/syscall": {},
                        "f:cpu-feature.node.kubevirt.io/tsc": {},
                        "f:cpu-feature.node.kubevirt.io/tsc-deadline": {},
                        "f:cpu-feature.node.kubevirt.io/tsc_adjust": {},
                        "f:cpu-feature.node.kubevirt.io/umip": {},
                        "f:cpu-feature.node.kubevirt.io/vme": {},
                        "f:cpu-feature.node.kubevirt.io/vmx": {},
                        "f:cpu-feature.node.kubevirt.io/x2apic": {},
                        "f:cpu-feature.node.kubevirt.io/xgetbv1": {},
                        "f:cpu-feature.node.kubevirt.io/xsave": {},
                        "f:cpu-feature.node.kubevirt.io/xsavec": {},
                        "f:cpu-feature.node.kubevirt.io/xsaveopt": {},
                        "f:cpu-feature.node.kubevirt.io/xsaves": {},
                        "f:cpu-model-migration.node.kubevirt.io/Broadwell-noTSX": {},
                        "f:cpu-model-migration.node.kubevirt.io/Broadwell-noTSX-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Cooperlake": {},
                        "f:cpu-model-migration.node.kubevirt.io/Haswell-noTSX": {},
                        "f:cpu-model-migration.node.kubevirt.io/Haswell-noTSX-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model-migration.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model-migration.node.kubevirt.io/Penryn": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Skylake-Client-noTSX-IBRS": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere": {},
                        "f:cpu-model-migration.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Broadwell-noTSX": {},
                        "f:cpu-model.node.kubevirt.io/Broadwell-noTSX-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Haswell-noTSX": {},
                        "f:cpu-model.node.kubevirt.io/Haswell-noTSX-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge": {},
                        "f:cpu-model.node.kubevirt.io/IvyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem": {},
                        "f:cpu-model.node.kubevirt.io/Nehalem-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G1": {},
                        "f:cpu-model.node.kubevirt.io/Opteron_G2": {},
                        "f:cpu-model.node.kubevirt.io/Penryn": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge": {},
                        "f:cpu-model.node.kubevirt.io/SandyBridge-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Skylake-Client-noTSX-IBRS": {},
                        "f:cpu-model.node.kubevirt.io/Westmere": {},
                        "f:cpu-model.node.kubevirt.io/Westmere-IBRS": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-frequency": {},
                        "f:cpu-timer.node.kubevirt.io/tsc-scalable": {},
                        "f:cpu-vendor.node.kubevirt.io/Intel": {},
                        "f:cpumanager": {},
                        "f:host-model-cpu.node.kubevirt.io/Cooperlake": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-ssbd": {},
                        "f:host-model-required-features.node.kubevirt.io/amd-stibp": {},
                        "f:host-model-required-features.node.kubevirt.io/hypervisor": {},
                        "f:host-model-required-features.node.kubevirt.io/ibpb": {},
                        "f:host-model-required-features.node.kubevirt.io/ibrs": {},
                        "f:host-model-required-features.node.kubevirt.io/invtsc": {},
                        "f:host-model-required-features.node.kubevirt.io/md-clear": {},
                        "f:host-model-required-features.node.kubevirt.io/mpx": {},
                        "f:host-model-required-features.node.kubevirt.io/pdcm": {},
                        "f:host-model-required-features.node.kubevirt.io/ss": {},
                        "f:host-model-required-features.node.kubevirt.io/tsc_adjust": {},
                        "f:host-model-required-features.node.kubevirt.io/umip": {},
                        "f:host-model-required-features.node.kubevirt.io/vmx": {},
                        "f:host-model-required-features.node.kubevirt.io/xsaves": {},
                        "f:hyperv.node.kubevirt.io/base": {},
                        "f:hyperv.node.kubevirt.io/frequencies": {},
                        "f:hyperv.node.kubevirt.io/ipi": {},
                        "f:hyperv.node.kubevirt.io/reenlightenment": {},
                        "f:hyperv.node.kubevirt.io/reset": {},
                        "f:hyperv.node.kubevirt.io/runtime": {},
                        "f:hyperv.node.kubevirt.io/synic": {},
                        "f:hyperv.node.kubevirt.io/synic2": {},
                        "f:hyperv.node.kubevirt.io/synictimer": {},
                        "f:hyperv.node.kubevirt.io/time": {},
                        "f:hyperv.node.kubevirt.io/tlbflush": {},
                        "f:hyperv.node.kubevirt.io/vpindex": {},
                        "f:kubevirt.io/schedulable": {},
                        "f:scheduling.node.kubevirt.io/tsc-frequency-1991999000": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "podCIDR": "10.244.3.0/24",
              "podCIDRs": [
                "10.244.3.0/24"
              ]
            },
            "status": {
              "capacity": {
                "cpu": "16",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "959218776Ki",
                "hugepages-1Gi": "0",
                "hugepages-2Mi": "0",
                "memory": "32613896Ki",
                "pods": "110"
              },
              "allocatable": {
                "cpu": "16",
                "devices.kubevirt.io/kvm": "1k",
                "devices.kubevirt.io/tun": "1k",
                "devices.kubevirt.io/vhost-net": "1k",
                "ephemeral-storage": "884016022498",
                "hugepages-1Gi": "0",
                "hugepages-2Mi": "0",
                "memory": "32511496Ki",
                "pods": "110"
              },
              "conditions": [],
              "addresses": [],
              "daemonEndpoints": {
                "kubeletEndpoint": {
                  "Port": 10250
                }
              },
              "nodeInfo": {
                "machineID": "19debd9169de45419aeab3f9528bc84e",
                "systemUUID": "4c4c4544-0050-5810-8058-c7c04f304e33",
                "bootID": "c006e127-1018-41d9-a647-c2620ff13660",
                "kernelVersion": "5.15.0-58-generic",
                "osImage": "Linux",
                "containerRuntimeVersion": "containerd://1.5.9",
                "kubeletVersion": "v1.24.6",
                "kubeProxyVersion": "v1.24.6",
                "operatingSystem": "linux",
                "architecture": "amd64"
              },
              "images": []
            }
          }
        ]
      };

    static getNamespaces = {
        "kind": "NamespaceList",
        "apiVersion": "v1",
        "metadata": {
          "resourceVersion": "65952557"
        },
        "items": [
          {
            "metadata": {
              "name": "cdi",
              "uid": "98bda882-4442-46af-a0a4-3db9ffa9aaaf",
              "resourceVersion": "18477748",
              "creationTimestamp": "2022-11-23T23:41:49Z",
              "labels": {
                "cdi.kubevirt.io": "",
                "kubernetes.io/metadata.name": "cdi"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-11-23T23:41:49Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:cdi.kubevirt.io": {},
                        "f:kubernetes.io/metadata.name": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          },
          {
            "metadata": {
              "name": "default",
              "uid": "5e3bec10-3d23-4b08-9826-46b9249e9e71",
              "resourceVersion": "199",
              "creationTimestamp": "2022-10-11T19:50:21Z",
              "labels": {
                "kubernetes.io/metadata.name": "default"
              },
              "managedFields": [
                {
                  "manager": "kube-apiserver",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:50:21Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        ".": {},
                        "f:kubernetes.io/metadata.name": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          },
          {
            "metadata": {
              "name": "kube-node-lease",
              "uid": "3e37f6cc-b3e5-4c1c-a51e-46f3b4e568a7",
              "resourceVersion": "6",
              "creationTimestamp": "2022-10-11T19:50:19Z",
              "labels": {
                "kubernetes.io/metadata.name": "kube-node-lease"
              },
              "managedFields": [
                {
                  "manager": "kube-apiserver",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:50:19Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        ".": {},
                        "f:kubernetes.io/metadata.name": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          },
          {
            "metadata": {
              "name": "kube-system",
              "uid": "33f63ccf-f8d5-4551-a2b5-bc247fae7c44",
              "resourceVersion": "4",
              "creationTimestamp": "2022-10-11T19:50:19Z",
              "labels": {
                "kubernetes.io/metadata.name": "kube-system"
              },
              "managedFields": [
                {
                  "manager": "kube-apiserver",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-11T19:50:19Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        ".": {},
                        "f:kubernetes.io/metadata.name": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          },
          {
            "metadata": {
              "name": "kubevirt",
              "uid": "f185e733-339f-482c-a7c7-b5f00d833ec2",
              "resourceVersion": "3963179",
              "creationTimestamp": "2022-10-21T19:42:40Z",
              "labels": {
                "kubernetes.io/metadata.name": "kubevirt",
                "kubevirt.io": "",
                "openshift.io/cluster-monitoring": "true"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-21T19:42:40Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:kubernetes.io/metadata.name": {},
                        "f:kubevirt.io": {}
                      }
                    }
                  }
                },
                {
                  "manager": "Go-http-client",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2022-10-21T19:47:45Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:labels": {
                        "f:openshift.io/cluster-monitoring": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          },
          {
            "metadata": {
              "name": "kubevirt-manager",
              "uid": "71d67a95-d07b-4d9b-baf6-97db0dd75db7",
              "resourceVersion": "65734364",
              "creationTimestamp": "2023-01-31T14:56:43Z",
              "labels": {
                "app": "kubevirt-manager",
                "kubernetes.io/metadata.name": "kubevirt-manager",
                "kubevirt-manager.io/version": "1.2.1"
              },
              "annotations": {},
              "managedFields": [
                {
                  "manager": "kubectl-client-side-apply",
                  "operation": "Update",
                  "apiVersion": "v1",
                  "time": "2023-01-31T14:56:43Z",
                  "fieldsType": "FieldsV1",
                  "fieldsV1": {
                    "f:metadata": {
                      "f:annotations": {
                        ".": {},
                        "f:kubectl.kubernetes.io/last-applied-configuration": {}
                      },
                      "f:labels": {
                        ".": {},
                        "f:app": {},
                        "f:kubernetes.io/metadata.name": {},
                        "f:kubevirt-manager.io/version": {}
                      }
                    }
                  }
                }
              ]
            },
            "spec": {
              "finalizers": [
                "kubernetes"
              ]
            },
            "status": {
              "phase": "Active"
            }
          }
        ]
      };
}
