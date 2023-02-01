import { K8sApisTestdata } from './k8s-apis-testdata.model';

describe('K8sApisTestdata', () => {
  it('should create an instance', () => {
    expect(new K8sApisTestdata()).toBeTruthy();
  });
});
