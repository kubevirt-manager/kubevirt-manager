import { Services } from './services.apitemplate';

describe('Services', () => {
  it('should create an instance', () => {
    expect(new Services()).toBeTruthy();
  });
  it('should have serviceTemplate', () => {
    let serviceTemplate = new Services().serviceTemplate;
    expect(serviceTemplate).toBeTruthy();
  });
  it('should have servicePortTemplate', () => {
    let servicePortTemplate = new Services().servicePortTemplate;
    expect(servicePortTemplate).toBeTruthy();
  });
});
