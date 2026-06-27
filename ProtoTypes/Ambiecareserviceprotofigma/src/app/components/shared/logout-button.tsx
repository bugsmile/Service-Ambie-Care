// Logout button component
interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button
      onClick={onLogout}
      className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      로그아웃
    </button>
  );
}
