import { useMemo, useState } from 'react';

export function useTabs(initialMain = 'cust') {
  const [activeMain, setActiveMain] = useState(initialMain);
  const [activeSub, setActiveSub] = useState(null);

  const changeMain = (tabId, firstSub) => {
    setActiveMain(tabId);
    setActiveSub(firstSub);
  };

  return {
    activeMain,
    activeSub,
    setActiveMain,
    setActiveSub,
    changeMain,
  };
}
