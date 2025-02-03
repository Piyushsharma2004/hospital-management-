//SidebarItem.tsx
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

interface SidebarItemProps {
  item: {
    label: string;
    route: string;
    icon: React.ReactNode;
    children?: any;
    pro?: boolean;
  };
  pageName: string;
  setPageName: (pageName: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, pageName, setPageName }) => {
  const pathname = usePathname();

  // Check if current path matches any child route
  const isChildActive = item.children?.some((child: any) => 
    pathname && (pathname === child.route || pathname.startsWith(child.route + '/'))
  );

  // Sync pageName with current route or if any child is active
  useEffect(() => {
    if (pathname === item.route || isChildActive) {
      setPageName(item.label.toLowerCase());
    }
  }, [pathname, item.route, item.label, setPageName, isChildActive]);

  const handleClick = () => {
    if (item.children) {
      // For items with children, just toggle the dropdown
      const updatedPageName =
        pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
      setPageName(updatedPageName);
    } else {
      // For items without children, always set the page name
      setPageName(item.label.toLowerCase());
    }
  };

  const isActive = pathname === item.route || isChildActive;
  const isExpanded = pageName === item.label.toLowerCase();

  return (
    <li>
    <Link
      href={item.children ? "#" : item.route}
      onClick={(e) => {
        if (item.children) {
          e.preventDefault();
        }
        handleClick();
      }}
      className={`${
        isActive
          ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
          : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
      } group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
    >
      {item.icon}
      {item.label}
      
      {/* Add Pro label for specific items */}
      {item.pro && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
          Doctor
        </span>
      )}

      {item.children && (
        <svg
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 fill-current ${
            !isExpanded && "rotate-180"
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5525 7.72801C10.81 7.50733 11.1899 7.50733 11.4474 7.72801L17.864 13.228C18.1523 13.4751 18.1857 13.9091 17.9386 14.1974C17.6915 14.4857 17.2575 14.5191 16.9692 14.272L10.9999 9.15549L5.03068 14.272C4.7424 14.5191 4.30838 14.4857 4.06128 14.1974C3.81417 13.9091 3.84756 13.4751 4.13585 13.228L10.5525 7.72801Z"
            fill=""
          />
        </svg>
      )}
    </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden ${
            !isExpanded && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;