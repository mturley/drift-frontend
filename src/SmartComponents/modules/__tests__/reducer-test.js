import { compareReducer } from '../reducers';
import types from '../types';
import { ASC, DESC } from '../../../constants';

import { compareReducerPayload, compareReducerState, sortedDesc,
    paginatedStatePageOne, paginatedStatePageTwo } from './reducer.fixtures';
import { factFilteredStateOne, factFilteredStateTwo } from './reducer.fact-filter-fixtures';
import stateFilteredFixtures from './reducer.state-filter-fixtures';
import stateFilters from './state-filter.fixtures';

describe('compare reducer', () => {
    it('should return initial state', () => {
        expect(compareReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                sortedFilteredFacts: [],
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue,
                factSort: ASC,
                stateSort: DESC,
                filteredCompareData: [],
                systems: [],
                previousStateSystems: [],
                page: 1,
                perPage: 50,
                historicalProfiles: [],
                totalFacts: 0,
                baselines: [],
                loading: false,
                expandedRows: [],
                error: {},
                emptyState: true,
                referenceId: undefined
            }
        );
    });

    it('should handle CLEAR_COMPARISON', () => {
        expect(
            compareReducer({
                fullCompareData: compareReducerState.facts,
                filteredCompareData: compareReducerState.facts,
                sortedFilteredFacts: compareReducerState.facts,
                systems: compareReducerState.systems,
                referenceId: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                perPage: 10,
                factSort: DESC,
                stateSort: ASC,
                stateFilters: stateFilters.diffStateTrue,
                factFilter: 'dog',
                expandedRows: [ 'something', 'something-else' ]}, {
                type: `${types.CLEAR_COMPARISON}` })
        ).toEqual({
            baselines: [],
            fullCompareData: [],
            sortedFilteredFacts: [],
            referenceId: undefined,
            factFilter: 'dog',
            stateFilters: stateFilters.diffStateTrue,
            factSort: DESC,
            stateSort: ASC,
            filteredCompareData: [],
            systems: [],
            previousStateSystems: [],
            page: 1,
            perPage: 10,
            historicalProfiles: [],
            totalFacts: 0,
            loading: false,
            expandedRows: [],
            error: {},
            emptyState: true
        });
    });

    it('should handle CLEAR_COMPARISON_FILTERS', () => {
        expect(
            compareReducer({
                baselines: [],
                emptyState: false,
                expandedRows: [],
                historicalProfiles: [],
                previousStateSystems: [],
                fullCompareData: compareReducerPayload.facts,
                filteredCompareData: compareReducerPayload.facts,
                sortedFilteredFacts: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                referenceId: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                perPage: 10,
                factSort: DESC,
                stateSort: ASC,
                stateFilters: stateFilters.diffStateTrue,
                factFilter: 'dog' }, {
                type: `${types.CLEAR_COMPARISON_FILTERS}` })
        ).toEqual({
            baselines: [],
            fullCompareData: compareReducerPayload.facts,
            sortedFilteredFacts: [],
            referenceId: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            factFilter: '',
            stateFilters: stateFilters.allStatesFalse,
            factSort: DESC,
            stateSort: ASC,
            filteredCompareData: [],
            systems: sortedDesc.systems,
            previousStateSystems: [],
            page: 1,
            perPage: 10,
            historicalProfiles: [],
            totalFacts: 0,
            expandedRows: [],
            emptyState: false
        });
    });

    it('should handle REVERT_COMPARE_DATA', () => {
        expect(
            compareReducer({
                systems: [ 'abc123', 'def456' ],
                previousStateSystems: [ 'abc123' ]}, {
                type: `${types.REVERT_COMPARE_DATA}` })
        ).toEqual({
            loading: false,
            error: {},
            previousStateSystems: [ 'abc123' ],
            systems: [ 'abc123' ]
        });
    });

    it('should handle FETCH_COMPARE_PENDING', () => {
        expect(
            compareReducer({ systems: [], loading: false }, {
                type: `${types.FETCH_COMPARE}_PENDING`
            })
        ).toEqual({
            baselines: [],
            previousStateSystems: [],
            systems: [],
            loading: true,
            historicalProfiles: [],
            emptyState: false
        });
    });

    it('should handle FETCH_COMPARE_PENDING with previous systems', () => {
        expect(
            compareReducer({ systems: compareReducerPayload.systems, loading: false }, {
                type: `${types.FETCH_COMPARE}_PENDING`
            })
        ).toEqual({
            baselines: [],
            previousStateSystems: compareReducerState.systems,
            systems: [],
            loading: true,
            historicalProfiles: [],
            emptyState: false
        });
    });

    it('should handle FETCH_COMPARE_REJECTED with invalid UUID', () => {
        expect(
            compareReducer({ }, {
                type: `${types.FETCH_COMPARE}_REJECTED`,
                payload: { response: {
                    data: { message: 'system_id 7 is not a UUID' },
                    status: 400
                }}
            })
        ).toEqual({
            emptyState: true,
            loading: false,
            error: {
                detail: 'system_id 7 is not a UUID',
                status: 400
            }
        });
    });

    it('should handle FETCH_COMPARE_REJECTED with 500', () => {
        expect(
            compareReducer({ }, {
                type: `${types.FETCH_COMPARE}_REJECTED`,
                payload: { response: {
                    data: '',
                    statusText: 'Service is unreachable',
                    status: 500
                }}
            })
        ).toEqual({
            emptyState: true,
            loading: false,
            error: {
                detail: 'Service is unreachable',
                status: 500
            }
        });
    });

    it('should handle FETCH_COMPARE_REJECTED with 400', () => {
        expect(
            compareReducer({ }, {
                type: `${types.FETCH_COMPARE}_REJECTED`,
                payload: { response: {
                    data: { detail: 'This is a 400 error' },
                    status: 400
                }}
            })
        ).toEqual({
            emptyState: true,
            loading: false,
            error: {
                detail: 'This is a 400 error',
                status: 400
            }
        });
    });

    it('should handle FETCH_COMPARE_FULFILLED', () => {
        expect(
            compareReducer({
                perPage: 50,
                page: 1,
                stateFilters: stateFilters.allStatesTrue,
                factFilter: '' },
            {
                payload: compareReducerPayload,
                type: `${types.FETCH_COMPARE}_FULFILLED`
            })
        ).toEqual({
            baselines: [],
            historicalProfiles: [],
            fullCompareData: compareReducerState.facts,
            loading: false,
            factFilter: '',
            filteredCompareData: compareReducerState.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 3,
            emptyState: false
        });
    });

    it('should handle fullCompareData undefined', () => {
        expect(
            compareReducer({
                perPage: 50,
                page: 1,
                stateFilters: stateFilters.allStatesTrue,
                factFilter: '' },
            {
                payload: { facts: [], systems: []},
                type: `${types.FETCH_COMPARE}_FULFILLED`
            })
        ).toEqual({
            baselines: [],
            historicalProfiles: [],
            fullCompareData: [],
            loading: false,
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: [],
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 0,
            emptyState: false
        });
    });

    it('should handle UPDATE_DRIFT_PAGINATION no data', () => {
        expect(
            compareReducer({
                perPage: 50,
                page: 1,
                fullCompareData: [],
                systems: [],
                factFilter: '',
                stateFilter: 'all' },
            {
                payload: { perPage: 2, page: 1 },
                type: `${types.UPDATE_DRIFT_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: [],
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: [],
            page: 1,
            perPage: 2,
            stateFilter: 'all',
            totalFacts: 0
        });
    });

    it('should handle UPDATE_DRIFT_PAGINATION page one', () => {
        expect(
            compareReducer({
                perPage: 50,
                page: 1,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: { perPage: 2, page: 1 },
                type: `${types.UPDATE_DRIFT_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: paginatedStatePageOne.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageOne.systems,
            page: 1,
            perPage: 2,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION page two', () => {
        expect(
            compareReducer({
                perPage: 2,
                page: 1,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: { perPage: 2, page: 2 },
                type: `${types.UPDATE_DRIFT_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: paginatedStatePageTwo.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageTwo.systems,
            page: 2,
            perPage: 2,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION page three is empty', () => {
        expect(
            compareReducer({
                perPage: 2,
                page: 2,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: { perPage: 2, page: 3 },
                type: `${types.UPDATE_DRIFT_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageTwo.systems,
            page: 3,
            perPage: 2,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 3
        });
    });

    it('should handle ADD_STATE_FILTER: SAME', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: {
                    filter: 'SAME',
                    display: 'Same',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateSame,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateSame,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.sameStateTrue,
            totalFacts: 1
        });
    });

    it('should handle ADD_STATE_FILTER: DIFFERENT', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateDifferent,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateDifferent,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: [
                {
                    filter: 'SAME',
                    display: 'Same',
                    selected: false
                },
                {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: true
                },
                {
                    filter: 'INCOMPLETE_DATA',
                    display: 'Incomplete data',
                    selected: false
                }
            ],
            totalFacts: 1
        });
    });

    it('should handle ADD_STATE_FILTER: INCOMPLETE_DATA', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: {
                    filter: 'INCOMPLETE_DATA',
                    display: 'Incomplete data',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateIncomplete,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateIncomplete,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.incompleteStateTrue,
            totalFacts: 1
        });
    });

    it('should handle ADD_STATE_FILTER: SAME and INCOMPLETE_DATA', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.sameStateTrue },
            {
                payload: {
                    filter: 'INCOMPLETE_DATA',
                    display: 'Incomplete data',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateSameIncomplete,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateSameIncomplete,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.diffStateFalse,
            totalFacts: 2
        });
    });

    it('should handle ADD_STATE_FILTER: SAME and DIFFERENT', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.sameStateTrue },
            {
                payload: {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateSameDiff,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateSameDiff,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.incompleteStateFalse,
            totalFacts: 2
        });
    });

    it('should handle ADD_STATE_FILTER: DIFFERENT and INCOMPLETE_DATA', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.incompleteStateTrue },
            {
                payload: {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: true
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: stateFilteredFixtures.stateFilteredStateDiffIncomplete,
            sortedFilteredFacts: stateFilteredFixtures.stateFilteredStateDiffIncomplete,
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.sameStateFalse,
            totalFacts: 2
        });
    });

    it('should handle no state filters', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
                systems: stateFilteredFixtures.stateFilteredStateAll.systems,
                factFilter: '',
                stateFilters: stateFilters.diffStateTrue },
            {
                payload: {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: false
                },
                type: `${types.ADD_STATE_FILTER}`
            })
        ).toEqual({
            fullCompareData: stateFilteredFixtures.stateFilteredStateAll.facts,
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: stateFilteredFixtures.stateFilteredStateAll.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0
        });
    });

    it('should handle FILTER_BY_FACT with text: i', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: 'i',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'i',
            filteredCompareData: factFilteredStateOne.facts,
            sortedFilteredFacts: factFilteredStateOne.facts,
            systems: factFilteredStateOne.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 2
        });
    });

    it('should handle FILTER_BY_FACT with text: io', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: 'i',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: factFilteredStateTwo.facts,
            sortedFilteredFacts: factFilteredStateTwo.facts,
            systems: factFilteredStateTwo.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 1
        });
    });

    it('should handle FILTER_BY_FACT with text: iou', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: 'io',
                stateFilters: stateFilters.allStatesTrue },
            {
                payload: 'iou',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'iou',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesTrue,
            totalFacts: 0
        });
    });

    it('should handle FILTER_BY_FACT with text: io and state: SAME', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.sameStateTrue },
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: factFilteredStateTwo.facts,
            sortedFilteredFacts: factFilteredStateTwo.facts,
            systems: factFilteredStateTwo.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.sameStateTrue,
            totalFacts: 1
        });
    });

    it('should handle FILTER_BY_FACT with text: io and state: DIFFERENT', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: stateFilters.diffStateTrue },
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.diffStateTrue,
            totalFacts: 0
        });
    });

    it('should handle TOGGLE_FACT_SORT DESC', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                factSort: ASC,
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: DESC,
                type: `${types.TOGGLE_FACT_SORT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0,
            factFilter: '',
            factSort: DESC
        });
    });

    it('should handle TOGGLE_FACT_SORT ASC', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                factSort: DESC,
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: ASC,
                type: `${types.TOGGLE_FACT_SORT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0,
            factFilter: '',
            factSort: ASC
        });
    });

    it('should handle TOGGLE_STATE_SORT ASC', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateSort: DESC,
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: ASC,
                type: `${types.TOGGLE_STATE_SORT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0,
            factFilter: '',
            stateSort: ASC
        });
    });

    it('should handle TOGGLE_STATE_SORT none', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateSort: ASC,
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: '',
                type: `${types.TOGGLE_STATE_SORT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0,
            factFilter: '',
            stateSort: ''
        });
    });

    it('should handle TOGGLE_STATE_SORT DESC', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateSort: '',
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: ASC,
                type: `${types.TOGGLE_STATE_SORT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            totalFacts: 0,
            factFilter: '',
            stateSort: ASC
        });
    });

    it('should handle EXPAND_ROW with new fact', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                expandedRows: [],
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: 'bios_uuid',
                type: `${types.EXPAND_ROW}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            factFilter: '',
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            expandedRows: [ 'bios_uuid' ],
            totalFacts: 0
        });
    });

    it('should handle EXPAND_ROW to collapse fact', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                expandedRows: [ 'bios_uuid', 'display_name' ],
                stateFilters: stateFilters.allStatesFalse },
            {
                payload: 'bios_uuid',
                type: `${types.EXPAND_ROW}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            factFilter: '',
            page: 1,
            perPage: 50,
            stateFilters: stateFilters.allStatesFalse,
            expandedRows: [ 'display_name' ],
            totalFacts: 0
        });
    });

    it('should handle EXPORT_TO_CSV', () => {
        expect(compareReducer(undefined,
            { type: `${types.EXPORT_TO_CSV}` })
        ).toEqual(
            {
                baselines: [],
                fullCompareData: [],
                sortedFilteredFacts: [],
                factFilter: '',
                stateFilters: stateFilters.allStatesTrue,
                factSort: ASC,
                stateSort: DESC,
                filteredCompareData: [],
                systems: [],
                previousStateSystems: [],
                page: 1,
                perPage: 50,
                historicalProfiles: [],
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                error: {},
                emptyState: true
            }
        );
    });

    it('should handle UPDATE_REFERENCE_ID', () => {
        expect(
            compareReducer({
                referenceId: undefined },
            {
                payload: 'abcd-1234-efgh-5678',
                type: `${types.UPDATE_REFERENCE_ID}`
            })
        ).toEqual(
            {
                referenceId: 'abcd-1234-efgh-5678'
            }
        );
    });
});
