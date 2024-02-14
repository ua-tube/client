import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
  () => import('@/components/layouts/dashboard'),
  { loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)


const ChannelCommentsPage: FC = () => {

    return <>
      <AppHead title="Коментарі" />
      <DashboardLayout>

      </DashboardLayout>
    </>

}

export default ChannelCommentsPage
