import { createContext, useContext } from 'react';

interface NavCollapseCtx {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const NavCollapseContext = createContext<NavCollapseCtx>({
  isCollapsed: false,
  onToggleCollapse: () => {},
});

export const useNavCollapse = () => useContext(NavCollapseContext);
