// Navigation links component with active route highlighting
interface NavigationLink {
  label: string;
  path: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function NavigationLinks({ links, currentPath, onNavigate }: NavigationLinksProps) {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive = currentPath === link.path || currentPath.startsWith(link.path);

        return (
          <button
            key={link.path}
            onClick={() => onNavigate(link.path)}
            className={`
              w-full text-left px-4 py-2.5 rounded-lg transition-colors
              ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}
