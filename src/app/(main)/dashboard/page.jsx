"use client";

import React from 'react';
import DesboardComp from '@/components/DesboardComp';

export default function DashboardPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-theme(spacing.14)-2rem)]">
     
      <DesboardComp />
    </div>
  );
}