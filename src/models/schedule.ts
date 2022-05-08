export type Period = {
    h: number,
    m: number
};

export type WorkingHour = {
    from: Period,
    to: Period
}

export type Schedule = {
    workingHours: WorkingHour[],
    closed: boolean
}

export function newSchedules(): Schedule[] {
    return [
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 18, m: 30 },
                },
            ],
            closed: false,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 18, m: 30 },
                },
            ],
            closed: false,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 18, m: 30 },
                },
            ],
            closed: false,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 18, m: 30 },
                },
            ],
            closed: false,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 18, m: 30 },
                },
            ],
            closed: false,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 14, m: 30 },
                },
            ],
            closed: true,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 14, m: 30 },
                },
            ],
            closed: true,
        },
        {
            workingHours: [
                {
                    from: { h: 10, m: 0 },
                    to: { h: 14, m: 30 },
                },
            ],
            closed: true,
        },
    ]
}