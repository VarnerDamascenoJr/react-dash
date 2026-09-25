import type { ReactNode } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { NavLink } from 'react-router-dom';

interface SidebarNavItem {
  className?: string;
  end?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
}

interface SidebarNavSectionProps {
  items: SidebarNavItem[];
  title: string;
}

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

function SidebarNavEntry({ item }: { item: SidebarNavItem }) {
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
      className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
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
