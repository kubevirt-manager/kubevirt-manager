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
  it('should have Readiness Probe', () => {
    let tcpProbe = new Probe().readinessProbe;
    expect(tcpProbe).toBeTruthy();
  });
  it('should have Liveness Probe', () => {
    let tcpProbe = new Probe().livenessProbe;
    expect(tcpProbe).toBeTruthy();
  });
});
