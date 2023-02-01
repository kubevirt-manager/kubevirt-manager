import { VirtualMachineClusterInstanceType } from './virtual-machine-cluster-instance-type.apitemplate';

describe('VirtualMachineClusterInstanceType', () => {
  it('should create an instance', () => {
    expect(new VirtualMachineClusterInstanceType()).toBeTruthy();
  });
  it('should have template', () => {
    let template = new VirtualMachineClusterInstanceType().template;
    expect(template).toBeTruthy();
  });
});
