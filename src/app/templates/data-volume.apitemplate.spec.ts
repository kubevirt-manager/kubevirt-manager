import { DataVolume } from './data-volume.apitemplate';

describe('DataVolume', () => {
  it('should create an instance', () => {
    expect(new DataVolume()).toBeTruthy();
  });
  it('should have blankDisk', () => {
    let blankDisk = new DataVolume().blankDisk;
    expect(blankDisk).toBeTruthy();
  });
  it('should have httpDisk', () => {
    let urlDisk = new DataVolume().httpDisk;
    expect(urlDisk).toBeTruthy();
  });
  it('should have s3Disk', () => {
    let urlDisk = new DataVolume().s3Disk;
    expect(urlDisk).toBeTruthy();
  });
  it('should have gcsDisk', () => {
    let urlDisk = new DataVolume().gcsDisk;
    expect(urlDisk).toBeTruthy();
  });
  it('should have registryDisk', () => {
    let urlDisk = new DataVolume().registryDisk;
    expect(urlDisk).toBeTruthy();
  });
  it('should have pvcDisk', () => {
    let pvcDisk = new DataVolume().pvcDisk;
    expect(pvcDisk).toBeTruthy();
  });
});
