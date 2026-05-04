import { LogOut, Menu, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logoutUser } from '@/core/auth/slice/authSlice';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isSubmitting } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher className="static" />
        <div className="h-8 w-px bg-border mx-2" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export { Header };
