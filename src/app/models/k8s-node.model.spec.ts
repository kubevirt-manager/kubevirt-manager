import { K8sNode } from './k8s-node.model';

describe('K8sNode', () => {
  it('should create an instance', () => {
    expect(new K8sNode()).toBeTruthy();
  });
});
