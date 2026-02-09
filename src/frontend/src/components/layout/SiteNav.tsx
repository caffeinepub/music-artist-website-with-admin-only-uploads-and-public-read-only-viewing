import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import { useIsCallerAdmin } from '@/hooks/useQueries';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: isAdmin } = useIsCallerAdmin();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/music', label: 'Music' },
    { path: '/videos', label: 'Videos' },
    { path: '/shows', label: 'Shows' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/plans', label: 'Plans' },
  ];

  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/artist-logo.dim_512x512.png"
            alt="Artist Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                currentPath === link.path ? 'text-amber-500' : 'text-foreground/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LoginButton />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <LoginButton />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`text-base font-medium transition-colors hover:text-amber-500 ${
                      currentPath === link.path ? 'text-amber-500' : 'text-foreground/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
