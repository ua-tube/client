import { ReactNode } from 'react'

type UseState<S> = (action: S | ((prevState: S) => S)) => void

type TabType<T> = { key: T, title: string, children: ReactNode }

export type { UseState, TabType }