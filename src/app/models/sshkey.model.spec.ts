import { SSHKey } from './sshkey.model';

describe('SSHKey', () => {
  it('should create an instance', () => {
    expect(new SSHKey()).toBeTruthy();
  });
});
