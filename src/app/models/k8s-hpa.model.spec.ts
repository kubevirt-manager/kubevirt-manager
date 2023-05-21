import { K8sHPA } from './k8s-hpa.model';

describe('K8sHPA', () => {
  it('should create an instance', () => {
    expect(new K8sHPA()).toBeTruthy();
  });
});
