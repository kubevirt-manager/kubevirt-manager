import { FirewallPairs } from "./firewall-pairs.model";

export class FirewallFilter {
    type:           string = "";  // POD / NAMESPACE / CIDR
    value:          string = "";  // value
    pairs: FirewallPairs[] = [];
}
