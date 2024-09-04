import { FirewallFilter } from "./firewall-filter.model";
import { FirewallTarget } from "./firewall-target.model";

export class FirewallRule {
    name:               string = "";
    namespace:          string = "";
    type:               string = "";   // INGRESS / EGRESS
    target:     FirewallTarget = new FirewallTarget;
    filter:     FirewallFilter = new FirewallFilter;
}
