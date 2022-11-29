export class VirtualMachineClusterInstanceType {

    template = {
        'apiVersion': "instancetype.kubevirt.io/v1alpha1",
        'kind': "VirtualMachineClusterInstancetype",
        'metadata':{
          'name': ""
        },
        'spec': {
            'cpu': {
                'guest': 0
            },
            'memory': {
                'guest': ""
            }
        }
    };

}
