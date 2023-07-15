export class VirtualMachine {
    typedVM = {
        'apiVersion': "kubevirt.io/v1alpha3",
        'kind': "VirtualMachine",
        'metadata':{
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'instancetype': {
                'kind': "VirtualMachineClusterInstancetype",
                'name': ""
            },
            'running' : false,
            'template':{
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'nodeSelector':{},
                    'priorityClassName': "",
                    'domain': {
                        'devices': {
                            'disks':[{}],
                            'interfaces': [{}],
                            'networkInterfaceMultiqueue': true
                        },
                    },
                    'networks':[{}],
                    'volumes':[{}]
                }
            }
        }
    };

    customVM = {
        'apiVersion': "kubevirt.io/v1alpha3",
        'kind': "VirtualMachine",
        'metadata':{
            'name': "",
            'namespace': "",
            'labels': {}
        },
        'spec': {
            'running' : false,
            'template':{
                'metadata': {
                    'labels': {}
                },
                'spec': {
                    'nodeSelector':{},
                    'priorityClassName': "",
                    'domain': {
                        'cpu': {
                            'sockets': 0,
                            'threads': 0,
                            'cores': 0
                        },
                        'devices': {
                            'disks':[{}],
                            'interfaces': [{}],
                            'networkInterfaceMultiqueue': true
                        },
                        'resources': {
                            'requests': {
                                'memory': ""
                            }
                        }
                    },
                    'networks':[{}],
                    'volumes':[{}]
                }
            }
        }
    };
}
