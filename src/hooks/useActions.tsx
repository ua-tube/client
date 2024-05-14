import { rootActions } from '@/store/root-actions'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

export const useActions = () => bindActionCreators(rootActions, useDispatch())
