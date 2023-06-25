export class VMPool {

    myVmPoolCustom = {
        'apiVersion': "pool.kubevirt.io/v1alpha1",
        'kind': "VirtualMachinePool",
        'metadata': {
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'replicas': Number(),
            'selector': {
                'matchLabels': {}
            },
            'virtualMachineTemplate': {
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'dataVolumeTemplates': [{}],
                    'running': true,
                    'template': {
                        'metadata': {
                            'labels': {}
                        },
                        'spec': {
                            'domain': {
                                'cpu': {
                                    'cores': 0,
                                    'sockets': 0,
                                    'threads': 0
                                },
                                'devices': {
                                    'disks': [{}],
                                    'interfaces': [{}],
                                    'networkInterfaceMultiqueue': true
                                },
                                'resources': {
                                    'requests': {
                                        'memory': ""
                                    }
                                }
                            },
                            'priorityClassName': "",
                            'networks':[{}],
                            'volumes': [{}]
                        }
                    }
                }
            }
        },
    };

    myVmPoolType = {
        'apiVersion': "pool.kubevirt.io/v1alpha1",
        'kind': "VirtualMachinePool",
        'metadata': {
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'replicas': Number(),
            'selector': {
                'matchLabels': {}
            },
            'virtualMachineTemplate': {
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'dataVolumeTemplates': [{}],
                    'instancetype': {
                        'kind': "VirtualMachineClusterInstancetype",
                        'name': ""
                    },
                    'running': true,
                    'template': {
                        'metadata': {
                            'labels': {}
                        },
                        'spec': {
                            'domain': {
                                'devices': {
                                    'disks': [{}],
                                    'interfaces': [{}],
                                    'networkInterfaceMultiqueue': true
                                }
                            },
                            'priorityClassName': "",
                            'networks':[{}],
                            'volumes': [{}]
                        }
                    }
                }
            }
        },
    };
    
}
