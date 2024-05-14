import { AppHead, RecoveryPassForm } from '@/components'
import { FC } from 'react'

const UserRecoveryPasswordPage: FC = () => {
	return (
		<>
			<AppHead title='Відновлення паролю' />
			<div className='loader-container' children={<RecoveryPassForm />} />
		</>
	)
}

export default UserRecoveryPasswordPage
