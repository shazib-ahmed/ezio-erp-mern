import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
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
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => console.log('Logging out...')}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export { Header };
