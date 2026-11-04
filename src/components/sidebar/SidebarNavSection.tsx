import type { SidebarNavEntryProps, SidebarNavItem, SidebarNavSectionProps } from './sidebar.types';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

export default function SidebarNavSection({
  items,
  title,
}: SidebarNavSectionProps) {
  return (
    <>
      <ListSubheader className="title" component="div" disableSticky>
        {title}
      </ListSubheader>
      {items.map((item) => (
        <SidebarNavEntry item={item} key={item.label} />
      ))}
    </>
  );
}

function SidebarNavEntry({ item }: SidebarNavEntryProps) {
  const location = useLocation();
  const button = (
    <ListItemButton
      className={item.to ? 'navItemButton' : navStaticClassName(item.className)}
      component={item.to ? 'span' : 'div'}
      onClick={item.onClick}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  );

  if (!item.to) {
    return button;
  }

  return (
    <NavLink
      className={({ isActive }) =>
        `navItem${
          isNavItemActive(item, location.pathname, location.hash, isActive)
            ? ' active'
            : ''
        }`
      }
      end={item.end}
      to={item.to}
    >
      {button}
    </NavLink>
  );
}

function navStaticClassName(className: string | undefined) {
  return className ? `navStatic ${className}` : 'navStatic';
}

function isNavItemActive(
  item: SidebarNavItem,
  pathname: string,
  hash: string,
  routerIsActive: boolean
) {
  const targetHash = getHashFromTo(item.to);

  if (targetHash) {
    return pathname === '/' && hash === targetHash;
  }

  if (item.end && hash) {
    return false;
  }

  return routerIsActive;
}

function getHashFromTo(to: string | undefined) {
  const hashStart = to?.indexOf('#') ?? -1;

  return hashStart >= 0 ? to?.slice(hashStart) : undefined;
}
