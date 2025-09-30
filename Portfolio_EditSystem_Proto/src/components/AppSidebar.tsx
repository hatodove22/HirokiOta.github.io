import React from 'react';
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

interface AppSidebarProps {
  activeSection: 'home' | 'news' | 'projects' | 'papers' | 'settings';
  onSectionChange: (section: 'home' | 'news' | 'projects' | 'papers' | 'settings') => void;
}

const menuItems = [
  {
    id: 'home' as const,
    title: 'ホーム',
    icon: Home,
  },
  {
    id: 'news' as const,
    title: 'ニュース',
    icon: Newspaper,
  },
  {
    id: 'projects' as const,
    title: 'プロジェクト',
    icon: FolderOpen,
  },
  {
    id: 'papers' as const,
    title: '論文',
    icon: GraduationCap,
  },
  {
    id: 'settings' as const,
    title: '設定',
    icon: Settings,
  },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
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
                    onClick={() => onSectionChange(item.id)}
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
