import { Building2, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    section: "Gerenciamento",
  },
  {
    title: "Empresas",
    url: "/empresas",
    icon: Building2,
    section: "Gerenciamento",
  },
  {
    title: "Logs",
    url: "/logs",
    icon: FileText,
    section: "Sincronização",
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    section: "Sistema",
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 18.75C30.5 17.25 28.5 16.25 26.25 16.25C22.25 16.25 19 19.5 19 23.5C19 27.5 22.25 30.75 26.25 30.75C28.5 30.75 30.5 29.75 32 28.25L36.25 32.5C33.5 35.25 29.75 36.75 26.25 36.75C18.75 36.75 12.5 30.5 12.5 23C12.5 15.5 18.75 9.25 26.25 9.25C29.75 9.25 33.5 10.75 36.25 13.5L32 18.75Z" fill="currentColor" className="text-primary"/>
            <path d="M16 18.75C14.5 17.25 12.5 16.25 10.25 16.25C6.25 16.25 3 19.5 3 23.5C3 27.5 6.25 30.75 10.25 30.75C12.5 30.75 14.5 29.75 16 28.25L20.25 32.5C17.5 35.25 13.75 36.75 10.25 36.75C2.75 36.75 -3.5 30.5 -3.5 23C-3.5 15.5 2.75 9.25 10.25 9.25C13.75 9.25 17.5 10.75 20.25 13.5L16 18.75Z" fill="currentColor" className="text-primary"/>
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">Central Sankhya</h2>
            <p className="text-xs text-sidebar-foreground/60">Sincronização Oracle</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groupedItems).map(([section, items]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wide">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === item.url}
                      data-testid={`link-${item.title.toLowerCase()}`}
                      onClick={() => setLocation(item.url)}
                    >
                      <a href={item.url} className="flex items-center gap-3 px-6 py-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-6 py-4">
        <button
          onClick={() => console.log('Logout triggered')}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover-elevate active-elevate-2"
          data-testid="button-logout"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
