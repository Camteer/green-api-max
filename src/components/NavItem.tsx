import { cn } from '@/utils/cn';
import { ReactElement } from 'react';

interface NavItemProps {
	icon: ReactElement;
	name: string;
	isActive?: boolean;
	onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
	icon,
	name,
	isActive = false,
	onClick,
}) => {
	return (
		<div
			className={cn(
				`flex flex-col items-center`,
				`text-(--color-primary) font-normal text-[12px]`,
				`${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}  transition`,
			)}
			onClick={onClick}
		>
			{icon}
			<span>{name}</span>
		</div>
	);
};
