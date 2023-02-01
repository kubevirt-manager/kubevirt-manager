import { K8sTestdata } from './k8s-testdata.model';

describe('K8sTestdata', () => {
  it('should create an instance', () => {
    expect(new K8sTestdata()).toBeTruthy();
  });
});
