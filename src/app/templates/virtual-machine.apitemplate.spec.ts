import { VirtualMachine } from './virtual-machine.apitemplate';

describe('VirtualMachine', () => {
  it('should create an instance', () => {
    expect(new VirtualMachine()).toBeTruthy();
  });
  it('should have customVM', () => {
    let customVM = new VirtualMachine().customVM;
    expect(customVM).toBeTruthy();
  });
  it('should have typedVM', () => {
    let typedVM = new VirtualMachine().typedVM;
    expect(typedVM).toBeTruthy();
  });
});
