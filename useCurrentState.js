import { useState, useEffect, useCallback } from 'react'

const useCurrentState = UIRouter => {
  const { globals, stateService, transitionService } = UIRouter

  const [state, setState] = useState({
    state: globals.current,
    params: globals.params
  })

  const stableCallback = useCallback(trans => {
    const state = trans.to()
    const params = trans.params('to')
    setState({ state, params })
  }, [])

  useEffect(() => {
    const deregister = transitionService.onSuccess({}, stableCallback)
    return () => deregister()
  }, [transitionService])

  return { state, stateService }
}

export default useCurrentState
