import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Bot, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    { label: 'Agent Development', href: '/services/agent-development' },
    { label: 'Multi-Agent Systems', href: '/services/multi-agent-systems' },
    { label: 'AI Integration', href: '/services/ai-integration' },
    { label: 'Strategy Consulting', href: '/services/strategy-consulting' },
  ];

  const navLinks = [
    { label: 'Case Studies', href: '/case-studies', isRoute: true },
    { label: 'Blog', href: '/blog', isRoute: true },
    { label: 'About Us', href: '/about', isRoute: true },
    { label: 'Contact Us', href: '/contact', isRoute: true },
  ];

  const handleNavClick = (link: { href: string; isRoute: boolean }) => {
    if (link.isRoute) {
      navigate(link.href);
    } else {
      if (window.location.pathname !== '/') {
        navigate('/' + link.href);
      } else {
        const element = document.querySelector(link.href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Agentic<span className="text-primary">AI</span> Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium bg-transparent border-none cursor-pointer">
                Services
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {services.map((service) => (
                  <DropdownMenuItem key={service.label} asChild>
                    <Link to={service.href} className="cursor-pointer">
                      {service.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/get-started">
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Mobile Services Section */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Services</span>
              {services.map((service) => (
                <Link
                  key={service.label}
                  to={service.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-muted-foreground hover:text-foreground transition-colors py-1 pl-4 text-sm"
                >
                  {service.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-border pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 bg-transparent border-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            <Link to="/get-started" onClick={() => setIsMenuOpen(false)}>
              <Button variant="default" className="mt-2 w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
