export class VMDisk {
  namespace:       string  = "";
  name:            string  = "";
  size:            string  = "";
  status:          string  = "";
  progress:        string  = "";
  storageclass:    string  = "";
  succeeded:       boolean = false;
  bound:           boolean = false;
  /* need to remove */
  path: string = "";
  node: any;
}
