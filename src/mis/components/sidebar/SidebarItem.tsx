import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, type LucideIcon, Zap } from "lucide-react";
import { useSidebarState, type SubNavItem } from "./useSidebarState";

export interface SidebarItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  subItems?: SubNavItem[];
  divider?: boolean;
}

/**
 * Sidebar Navigation Item
 * Modern design with light/dark mode support
 */
export default function SidebarItem({
  path,
  label,
  icon: Icon,
  badge,
  subItems,
  divider = false,
}: SidebarItemProps) {
  const { t } = useTranslation();
  const { isCollapsed, expandedItems, toggleItem } = useSidebarState();
  const [isExpanded, setIsExpanded] = useState(expandedItems.includes(path));
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Check if dark mode
  const isDark = document.documentElement.classList.contains("dark");

  const hasSubItems = subItems && subItems.length > 0;

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPopover]);

  // Sync expanded state with global state
  useEffect(() => {
    setIsExpanded(expandedItems.includes(path));
  }, [expandedItems, path]);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      if (isCollapsed) {
        setShowPopover(!showPopover);
      } else {
        const newState = !isExpanded;
        setIsExpanded(newState);
        toggleItem(path);
      }
    }
  };

  const itemContent = () => (
    <>
      <div className={`flex flex-1 items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          isDark ? "text-zinc-400" : "text-slate-600"
        }`} />
        {!isCollapsed && (
          <span className={`text-sm font-medium truncate ${
            isDark ? "text-zinc-300" : "text-slate-700"
          }`}>
            {t(`mis.nav.${label.toLowerCase()}`, label)}
          </span>
        )}
      </div>

      {/* Badge */}
      {!isCollapsed && badge !== undefined && (
        <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
          isDark 
            ? "bg-zinc-600/30 text-zinc-300" 
            : "bg-slate-200 text-slate-700"
        }`}>
          {badge}
        </span>
      )}

      {/* Chevron for sub-items */}
      {!isCollapsed && hasSubItems && (
        <div className={`flex-shrink-0 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}>
          <ChevronDown className={`h-4 w-4 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
        </div>
      )}
    </>
  );

  return (
    <>
      <li className="relative group">
        <NavLink
          ref={buttonRef}
          to={hasSubItems ? "#" : path}
          end={path === "/mis"}
          onClick={handleToggle}
          className={({ isActive }) =>
            `relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 overflow-hidden ${
              isCollapsed ? "justify-center w-12 mx-auto" : ""
            } ${
              isActive && !hasSubItems
                ? isDark
                  ? "bg-gradient-to-r from-zinc-700 to-zinc-600 text-white shadow-lg shadow-zinc-500/20"
                  : "bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg shadow-slate-500/20"
                : isDark
                  ? "text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`
          }
        >
          {/* Active indicator */}
          {({ isActive }) => (
            <>
              {isActive && !hasSubItems && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
              )}
              {/* Hover background effect */}
              <div className={`absolute inset-0 transition-opacity duration-200 ${
                isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
              } ${
                isDark 
                  ? "bg-gradient-to-r from-zinc-700/30 to-zinc-600/30" 
                  : "bg-gradient-to-r from-slate-100 to-slate-50"
              }`} />
              <div className="relative z-10 flex w-full items-center">
                {itemContent()}
              </div>
            </>
          )}
        </NavLink>

        {/* Popover for collapsed sidebar with subitems */}
        {isCollapsed && hasSubItems && showPopover && (
          <div
            ref={popoverRef}
            className="fixed left-[72px] z-50 min-w-[220px] rounded-xl border shadow-2xl animate-fade-in"
            style={{
              top: buttonRef.current?.getBoundingClientRect().top || 0,
            }}
            onMouseLeave={() => setShowPopover(false)}
          >
            <div className={`border-b px-4 py-3 ${
              isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-slate-200"
            }`}>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                {label}
              </p>
            </div>
            <ul className={`p-2 space-y-0.5 ${
              isDark ? "bg-zinc-800" : "bg-white"
            }`}>
              {subItems.map((subItem) => (
                <li key={subItem.id}>
                  <NavLink
                    to={subItem.path}
                    onClick={() => setShowPopover(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? isDark
                            ? "bg-zinc-700/50 text-zinc-200"
                            : "bg-slate-200 text-slate-800"
                          : isDark
                            ? "text-zinc-400 hover:bg-zinc-700/30 hover:text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`
                    }
                  >
                    {subItem.icon && (
                      <subItem.icon className={`h-4 w-4 flex-shrink-0 ${
                        isDark ? "text-zinc-500" : "text-slate-500"
                      }`} />
                    )}
                    <span className="flex-1">{t(`mis.nav.${subItem.label.toLowerCase().replace(/\s+/g, '')}`, subItem.label)}</span>
                    {subItem.quickAction && (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isDark
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-100 text-emerald-600"
                      }`}>
                        <Zap className="h-3 w-3" />
                        Quick
                      </span>
                    )}
                  </NavLink>
                  {/* Tertiary items in popover */}
                  {subItem.children && subItem.children.length > 0 && (
                    <ul className="mt-1 ml-6 space-y-0.5">
                      {subItem.children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={child.path}
                            onClick={() => setShowPopover(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                                isActive
                                  ? isDark
                                    ? "text-zinc-300 font-semibold"
                                    : "text-slate-700 font-semibold"
                                  : isDark
                                    ? "text-zinc-500 hover:text-white"
                                    : "text-slate-500 hover:text-slate-700"
                              }`
                            }
                          >
                            <span className={`h-1 w-1 rounded-full ${
                              isDark ? "bg-zinc-600" : "bg-slate-400"
                            }`} />
                            <span>{t(`mis.nav.${child.label.toLowerCase()}`, child.label)}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sub-items (collapsible) */}
        {!isCollapsed && hasSubItems && isExpanded && (
          <ul className="mt-1.5 space-y-0.5 border-l-2 ml-6 py-1 px-2 animate-expand">
            {subItems.map((subItem) => (
              <li key={subItem.id}>
                <NavLink
                  to={subItem.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? isDark
                          ? "bg-zinc-700/50 text-zinc-200 border-l-2 border-zinc-500 -ml-[2px] pl-[10px]"
                          : "bg-slate-200 text-slate-800 border-l-2 border-slate-600 -ml-[2px] pl-[10px]"
                        : isDark
                          ? "text-zinc-400 hover:bg-zinc-700/30 hover:text-white hover:pl-1"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 hover:pl-1"
                    }`
                  }
                >
                  {subItem.icon && (
                    <subItem.icon className={`h-4 w-4 flex-shrink-0 ${
                      isDark ? "text-zinc-500/70" : "text-slate-500/70"
                    }`} />
                  )}
                  <span className="flex-1">{t(`mis.nav.${subItem.label.toLowerCase().replace(/\s+/g, '')}`, subItem.label)}</span>
                  {subItem.quickAction && (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      <Zap className="h-3 w-3" />
                      Quick
                    </span>
                  )}
                </NavLink>

                {/* Tertiary items (children) */}
                {subItem.children && subItem.children.length > 0 && (
                  <ul className="mt-1 ml-4 space-y-0.5 border-l border-zinc-700/30 pl-3">
                    {subItem.children.map((child) => (
                      <li key={child.id}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                              isActive
                                ? (isDark ? "text-zinc-300 font-semibold" : "text-slate-700 font-semibold")
                                : (isDark ? "text-zinc-500 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")
                            }`
                          }
                        >
                          <span className={`h-1 w-1 rounded-full ${
                            isDark ? "bg-zinc-600" : "bg-slate-400"
                          }`} />
                          <span>{t(`mis.nav.${child.label.toLowerCase()}`, child.label)}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>

      {/* Divider */}
      {divider && !isCollapsed && (
        <li className="my-3">
          <div className={`h-px ${isDark ? "bg-gradient-to-r from-transparent via-zinc-600/30 to-transparent" : "bg-gradient-to-r from-transparent via-slate-300 to-transparent"}`} />
        </li>
      )}
    </>
  );
}
