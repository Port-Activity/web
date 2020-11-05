import { useState, useCallback } from 'react';

import useOnClickOutside from './useOnClickOutside';

const useToggle = (initial = false, ref = null) => {
  const [open, setOpen] = useState(initial);
  useOnClickOutside(ref, () => setOpen(false));
  // eslint-disable-next-line
  return [open, useCallback(() => setOpen(status => !status))];
};

export default useToggle;
