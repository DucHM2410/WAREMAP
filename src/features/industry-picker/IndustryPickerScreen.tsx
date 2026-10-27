import { useApp } from '../../app/store'
import { IndustryPicker } from '../../shared/components/IndustryPicker'
import { useIndustry } from '../../shared/context/IndustryContext'

export default function IndustryPickerScreen() {
  const { go } = useApp()
  const { hasSavedIndustry } = useIndustry()

  return (
    <IndustryPicker
      onSelect={() => go('dashboard')}
      onCancel={hasSavedIndustry ? () => go('dashboard') : undefined}
    />
  )
}
