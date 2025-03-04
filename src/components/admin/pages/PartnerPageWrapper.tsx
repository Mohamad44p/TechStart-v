'use client'

import { PartnerPageForm } from "./PartnerPageForm"
import type { PartnerPageFormInput } from "@/lib/schema/partnerPageSchema"

interface PartnerPageWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any //
  action: (data: PartnerPageFormInput) => Promise<{ success: boolean; error?: string }>
  buttonText?: string
}

export function PartnerPageWrapper({ initialData , buttonText }: PartnerPageWrapperProps) {

  return (
    <PartnerPageForm
      initialData={initialData}
      partnerId={initialData?.id}
      buttonText={buttonText}
    />
  )
}
