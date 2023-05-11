import { Probe } from './probe.apitemplate';

describe('Probe', () => {
  it('should create an instance', () => {
    expect(new Probe()).toBeTruthy();
  });
  it('should have HTTP Probe', () => {
    let httpProbe = new Probe().httpProbe;
    expect(httpProbe).toBeTruthy();
  });
  it('should have TCP Probe', () => {
    let tcpProbe = new Probe().tcpProbe;
    expect(tcpProbe).toBeTruthy();
  });
});
