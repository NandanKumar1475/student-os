import {
  BarChart3,
  Box,
  BriefcaseBusiness,
  CheckSquare,
  Flame,
  Goal,
  LayoutDashboard,
  Library,
  NotebookText,
  UserCircle2,
} from 'lucide-react';

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview and priorities',
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: CheckSquare,
    description: 'Execution queue',
  },
  {
    path: '/targets',
    label: 'Targets',
    icon: Goal,
    description: 'Goals and milestones',
  },
  {
    path: '/notes',
    label: 'Notes',
    icon: NotebookText,
    description: 'Knowledge base',
  },
  {
    path: '/streaks',
    label: 'Streaks',
    icon: Flame,
    description: 'Consistency and XP',
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Insights and trends',
  },
  {
    path: '/jobs',
    label: 'Jobs',
    icon: BriefcaseBusiness,
    description: 'Career opportunities',
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: Library,
    description: 'Study materials',
  },
  {
    path: '/vr',
    label: 'VR Room',
    icon: Box,
    description: 'Immersive study space',
  },
];

export const profileNavItem = {
  path: '/profile',
  label: 'Profile',
  icon: UserCircle2,
  description: 'Personal settings',
};
