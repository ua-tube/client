import { useTypedSelector } from './'

export const useAuth = () => useTypedSelector(state => state.auth)
