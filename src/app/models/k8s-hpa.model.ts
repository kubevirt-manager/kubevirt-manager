export class K8sHPA {
    name:               string   = "";
    namespace:          string   = "";
    creationTimestamp:    Date   = new Date;
    scaleTarget:        string   = "";
    minReplicas:        number   = 0;
    maxReplicas:        number   = 0;
    metricName:         string   = "";
    metricType:         string   = "";
    metricAvg:          number   = 0;
    currentRpl:         number   = 0;
    desiredRpl:         number   = 0;
    currAvgUtl:         number   = 0;
}
