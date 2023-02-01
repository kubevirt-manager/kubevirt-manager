import { DataVolume } from './data-volume.apitemplate';

describe('DataVolume', () => {
  it('should create an instance', () => {
    expect(new DataVolume()).toBeTruthy();
  });
  it('should have blankDisk', () => {
    let blankDisk = new DataVolume().blankDisk;
    expect(blankDisk).toBeTruthy();
  });
  it('should have urlDisk', () => {
    let urlDisk = new DataVolume().urlDisk;
    expect(urlDisk).toBeTruthy();
  });
  it('should have pvcDisk', () => {
    let pvcDisk = new DataVolume().pvcDisk;
    expect(pvcDisk).toBeTruthy();
  });
});
