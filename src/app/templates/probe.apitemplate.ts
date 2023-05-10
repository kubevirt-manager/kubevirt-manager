export class Probe {
    httpProbe = {
        'path': "",
        'port': 0
    };

    tcpProbe = {
        'port': 0
    };

    healthCheck = {
        'tcpSocket': {},
        'httpGet': {},
        'initialDelaySeconds': 0,
        'periodSeconds': 0,
        'timeoutSeconds': 0,
        'failureThreshold': 0,
        'successThreshold': 0
    }
}
