export class Probe {
    httpProbe = {
        'httpGet': {
            'path': "",
            'port': 0
        },
        'initialDelaySeconds': 0,
        'periodSeconds': 0,
        'timeoutSeconds': 0,
        'failureThreshold': 0,
        'successThreshold': 0
    };

    tcpProbe = {
        'tcpSocket': {
            'port': 0
        },
        'initialDelaySeconds': 0,
        'periodSeconds': 0,
        'timeoutSeconds': 0,
        'failureThreshold': 0,
        'successThreshold': 0
    };
    
    readinessProbe = {}
    livenessProbe = {}
}
