import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BentoCardProps {
  className?: string;
  gradient?: string;
  delay?: number;
}

export interface Metric {
  label: string;
  value: string;
  change?: string;
  icon?: LucideIcon;
  gradient?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  count: number;
  active?: boolean;
}

export interface MessageBubble {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  avatar?: string;
}

export interface WaveformBar {
  height: number;
  delay: number;
}

export interface LanguageBadge {
  code: string;
  label: string;
}

export interface CodeLine {
  content: string;
  highlight?: boolean;
}

export interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

// New types for the redesigned cards
export interface PipelineStageItem {
  name: string;
  icon: LucideIcon;
  color?: string;
}

export interface PipelineStageConfig {
  id: string;
  label: string;
  items: PipelineStageItem[];
  isAdd?: boolean;
  active?: boolean;
}

export interface DeployNode {
  label: string;
  icon: LucideIcon;
  status: 'active' | 'pending' | 'inactive';
}

export interface FileType {
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface IntegrationNode {
  icon: LucideIcon;
  title: string;
}
