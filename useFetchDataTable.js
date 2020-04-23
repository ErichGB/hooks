import { useLazyQuery } from "@apollo/react-hooks";
// helper
import set from 'lodash/set'
import size from 'lodash/size'
import isEqual from 'lodash/isEqual'

const useFetchDataTable = (gql) => {
    const [fetch, states] = useLazyQuery(gql);

    const onFetchData = state => {
        const _state = {}

        if (size(state.filtered) > 0)
            state.filtered.forEach( ({id, value}) => {
                if(isEqual(id,'id')) set(_state, ['filter', id], parseInt(value))
                else set(_state, ['filter', id], value)
            })

        if (size(state.sorted) > 0)
            state.sorted.forEach( ({id, desc}) => {
                set(_state, 'sort.key', isEqual(id,'keys') ? 'tag' : id)
                set(_state, 'sort.value', desc ? 'desc' : 'asc')
            });

        const variables = {
            offset: state.page * state.pageSize,
            limit: state.pageSize,
            ..._state
        };

        fetch({variables})
    }

    return { ...states, onFetchData }
}

export default useFetchDataTable