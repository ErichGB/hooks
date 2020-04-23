import React, { useState } from 'react'
// components
import Checkbox from 'antd/lib/checkbox'
// helpers
import map from 'lodash/map'
import every from 'lodash/every'
import remove from 'lodash/remove'

const SelectInputComponent = (props) => {
    const { id:key, onClick, checked, row, indeterminate } = props
    const onChange = () => onClick(row)
    const propsCheckbox = { key, checked, onChange, indeterminate }
    return <Checkbox {...propsCheckbox} />
}

const background = '#ebf2ff'

const useSelectTable = (keyField, getTableInstance) => {
    const [keys, setKeys] = useState([])
    const [selection, setSelection] = useState([])

    const updateSelection = (newSelection) => {
        setKeys(map(newSelection, keyField))
        setSelection(newSelection)
    }

    const isSelected = (key) => keys.includes(key)

    const isDataSelected = () => {
        const data = getTableInstance('state.data')
        const keysData = map(data, keyField)
        const res = every(keysData, key => isSelected(key))
        return { res, data, keysData}
    }

    const toggleAll = () => {
        const { res, data, keysData} = isDataSelected()
        const freeSelection = [...selection]
        remove(freeSelection, sel => keysData.includes(sel[keyField]))
        const newSelection = res ? [...freeSelection] : [...freeSelection, ...data]
        updateSelection(newSelection)
    }

    const toggleSelection = (row) => {
        const key = row[keyField]
        if(isSelected(key)) {
            const index = keys.indexOf(key)
            const newSelection = [
                ...selection.slice(0, index),
                ...selection.slice(index + 1)
            ]
            updateSelection(newSelection)
        }
        else updateSelection([...selection, row])
    }

    const getTrProps = (_, rowInfo) =>
        (rowInfo && isSelected(rowInfo.original[keyField]))
            ? { style: { background } }
            : {}

    const SelectAllInputComponent = (props) => {
        const checked = keys.length > 0 && isDataSelected().res
        const indeterminate = keys.length > 0 && !checked
        const attr = { ...props, indeterminate, checked }
        return <SelectInputComponent {...attr} />
    }

    return [{
        keyField,
        toggleAll,
        isSelected,
        getTrProps,
        toggleSelection,
        SelectInputComponent,
        SelectAllInputComponent,
        selectWidth: 50
    }, selection, keys]
};

export default useSelectTable;
