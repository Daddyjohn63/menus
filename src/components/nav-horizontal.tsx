'use client';

import * as React from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

// Similar type as NavMain
type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavHorizontal({ items }: { items: NavItem[] }) {
  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  // Handle clicking a sub-item
  const handleSubItemClick = () => {
    setOpenDropdown(null);
  };

  // Handle toggling a dropdown
  const handleDropdownToggle = (title: string, isOpen: boolean) => {
    setOpenDropdown(isOpen ? title : null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="relative flex h-14 items-center gap-1 bg-background px-4"
    >
      {items.map(item => {
        // If no subitems, render simple link
        if (!item.items?.length) {
          return (
            <a
              key={item.title}
              href={item.url}
              className="flex h-9 items-center gap-2 rounded-md px-3 hover:bg-accent"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </a>
          );
        }

        // With subitems, render collapsible dropdown
        return (
          <Collapsible
            key={item.title}
            open={openDropdown === item.title}
            onOpenChange={isOpen => handleDropdownToggle(item.title, isOpen)}
          >
            <CollapsibleTrigger asChild>
              <button className="flex h-9 items-center gap-2 rounded-md px-3 hover:bg-accent">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md">
              {item.items.map(subItem => (
                <a
                  key={subItem.title}
                  href={subItem.url}
                  className="flex h-8 items-center rounded-sm px-2 hover:bg-accent"
                  onClick={handleSubItemClick}
                >
                  {subItem.title}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
}
