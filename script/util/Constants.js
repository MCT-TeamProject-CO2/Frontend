export const ApiHost = 'https://teamproject.pieceof.art';

export const PermissionLevels = Object.freeze([ 'info', 'admin', 'root' ]);

export const TimeTypes = [
    {
        aggregate: '2m',
        delta: 60
    },
    {
        aggregate: '30m',
        delta: 1440
    },
    {
        aggregate: '4h',
        delta: 10080
    },
    {
        aggregate: '15h',
        delta: 43800
    },
    {
        aggregate: '91h',
        delta: 262800
    },
    {
        aggregate: '8d',
        delta: 525601
    }
];