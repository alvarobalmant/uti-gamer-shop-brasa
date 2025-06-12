
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const DesktopNavigation = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex space-x-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-gray-300 bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent">
            Consoles
            <ChevronDown className="ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/playstation" title="PlayStation">
                Consoles, jogos e acessórios PlayStation
              </ListItem>
              <ListItem href="/xbox" title="Xbox">
                Consoles, jogos e acessórios Xbox
              </ListItem>
              <ListItem href="/xbox4" title="Xbox Universe">
                Explore o universo Xbox completo
              </ListItem>
              <ListItem href="/nintendo" title="Nintendo">
                Consoles, jogos e acessórios Nintendo
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-gray-300 bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent">
            Gaming
            <ChevronDown className="ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/pc-gaming" title="PC Gaming">
                Hardware e periféricos para PC
              </ListItem>
              <ListItem href="/retro-gaming" title="Retro Gaming">
                Consoles e jogos clássicos
              </ListItem>
              <ListItem href="/area-geek" title="Área Geek">
                Colecionáveis e produtos especiais
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/categoria/jogos" className="text-white hover:text-gray-300 transition-colors duration-200">
            Jogos
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/categoria/acessorios" className="text-white hover:text-gray-300 transition-colors duration-200">
            Acessórios
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/uti-pro" className="text-white hover:text-yellow-400 transition-colors duration-200 font-semibold">
            UTI PRO
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string; title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default DesktopNavigation;
