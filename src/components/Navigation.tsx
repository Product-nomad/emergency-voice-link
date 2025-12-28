import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, FileText, Shield, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/guide', label: 'Parents Guide', icon: BookOpen },
  { to: '/scripts', label: 'Scripts', icon: FileText },
  { to: '/protocol', label: 'Dispatcher Protocol', icon: Shield },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/resources', label: 'Resources', icon: ExternalLink },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm shadow-md border-border hover:bg-accent"
          >
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 bg-background">
          <SheetHeader className="text-left">
            <SheetTitle className="text-foreground text-lg font-semibold">
              911 Call Simulator
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
