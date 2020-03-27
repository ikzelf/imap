/**
 * Build params for fetch hosts problems
 * @param {Array<number>} hostIds
 * @return {{}}
 */
export const buildProblemListParams = (hostIds) => {
    return {
        'output': [
            'eventid',
            'objectid',
            'name',
            'severity',
            'clock',
            'acknowledged',
            'suppressed',
        ],
        'hostids': hostIds,
    }
};