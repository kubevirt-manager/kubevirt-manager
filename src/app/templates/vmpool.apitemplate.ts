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
                                    'interfaces': [{}]
                                },
                                'resources': {
                                    'requests': {
                                        'memory': ""
                                    }
                                }
                            },
                            'livenessProbe': {},
                            'readinessProbe': {},
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
                                    'interfaces': [{}]
                                }
                            },
                            'livenessProbe': {},
                            'readinessProbe': {},
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
