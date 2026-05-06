import { User } from '../types/user';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <div className="user-menu">
      <span>Welcome, {user.username} ({user.role})</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}