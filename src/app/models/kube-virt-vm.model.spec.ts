import { KubeVirtVM } from './kube-virt-vm.model';

describe('KubeVirtVM', () => {
  it('should create an instance', () => {
    expect(new KubeVirtVM()).toBeTruthy();
  });
});
