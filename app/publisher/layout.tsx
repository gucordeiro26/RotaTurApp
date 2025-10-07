"use client"

import { ReactNode } from 'react'
import { RouteGuard } from '@/components/RouteGuard'

export default function PublisherAuthLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={["publicador"]}>
      {children}
    </RouteGuard>
  )
}