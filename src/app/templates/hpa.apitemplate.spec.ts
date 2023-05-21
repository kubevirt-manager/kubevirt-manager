import { Hpa } from './hpa.apitemplate';

describe('Hpa', () => {
  it('should create an instance', () => {
    expect(new Hpa()).toBeTruthy();
  });
  it('should have cpuPercentageHPAv1', () => {
    let cpuPercentageHPAv1 = new Hpa().cpuPercentageHPAv1;
    expect(cpuPercentageHPAv1).toBeTruthy();
  });
  it('should have cpuPercentageHPAv2', () => {
    let cpuPercentageHPAv2 = new Hpa().cpuPercentageHPAv2;
    expect(cpuPercentageHPAv2).toBeTruthy();
  });
});
