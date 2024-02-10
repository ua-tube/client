type UseState<S> = (action: S | ((prevState: S) => S)) => void;


export type { UseState }