import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { LucideProps } from 'lucide-react'
import dynamic from 'next/dynamic'
import { memo } from 'react'

interface IconProps extends LucideProps {
	name: keyof typeof dynamicIconImports;
}

const _Icon = ({ name, ...props }: IconProps) => {
	const LucideIcon = dynamic(dynamicIconImports[name])

	return <LucideIcon {...props} />
}

export const DynamicIcon = memo(_Icon)
