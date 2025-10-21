import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, User, FileText, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/applications", label: "Applications", icon: FileText },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CareerHub
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? "default" : "ghost"}
                className="transition-smooth"
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
