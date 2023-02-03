import { VMPool } from './vmpool.apitemplate';

describe('VMPool', () => {
  it('should create an instance', () => {
    expect(new VMPool()).toBeTruthy();
  });
  it('should have Custom Pool', () => {
    let customPool = new VMPool().myVmPoolCustom;
    expect(customPool).toBeTruthy();
  });
  it('should have Typed Pool', () => {
    let typedPool = new VMPool().myVmPoolType;
    expect(typedPool).toBeTruthy();
  });
});
