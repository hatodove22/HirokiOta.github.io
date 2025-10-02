import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from './ui/sidebar';
import { Home, Newspaper, FolderOpen, GraduationCap, Settings } from 'lucide-react';

const menuItems = [
  {
    id: 'home' as const,
    title: 'ホーム',
    icon: Home,
    path: '/home',
  },
  {
    id: 'news' as const,
    title: 'ニュース',
    icon: Newspaper,
    path: '/news',
  },
  {
    id: 'projects' as const,
    title: 'プロジェクト',
    icon: FolderOpen,
    path: '/projects',
  },
  {
    id: 'papers' as const,
    title: '論文',
    icon: GraduationCap,
    path: '/papers',
  },
  {
    id: 'settings' as const,
    title: '設定',
    icon: Settings,
    path: '/settings',
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 現在のパスからアクティブなセクションを判定
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/papers')) return 'papers';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeSection = getActiveSection();
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <span className="font-semibold">Portfolio Editor</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
