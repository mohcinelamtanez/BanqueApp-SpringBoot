import { useEffect, useState } from "react";
// `extraDeps` lets a caller force a refetch (e.g. after saving an edit)
// without changing `id` itself — `loader` is still only ever called with
// `id`, extraDeps only affect when the effect re-runs.
export function useResource(loader, id, extraDeps = []) {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  });
  useEffect(() => {
    let active = true;
    setState({ loading: true, data: null, error: null });
    loader(id)
      .then((data) => active && setState({ loading: false, data, error: null }))
      .catch(
        (error) => active && setState({ loading: false, data: null, error }),
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ...extraDeps]);
  return state;
}
