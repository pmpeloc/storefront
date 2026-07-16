import { assertNavSectionEnabled } from '@/lib/nav-sections'
import { InspirationGrid } from '@/components/inspiration/InspirationGrid'

export default async function InspirationPage({ params }: { params: { tenant: string } }) {
  await assertNavSectionEnabled(params.tenant, 'inspiracion')
  return <InspirationGrid />
}
