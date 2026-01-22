import { getServices, getPromotions } from './actions'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  const services = await getServices()
  const promotions = await getPromotions()
  return <AdminDashboard services={services} promotions={promotions} />
}