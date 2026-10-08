import { cn } from '@/utils/cn';

interface ChatCardProps {
	name: string;
	avatar?: string;
	unreadCount?: number;
	isActive?: boolean;
	onClick?: () => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
	name,
	avatar,
	unreadCount = 0,
	isActive = false,
	onClick,
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex w-full items-center gap-3 rounded-xl p-3 text-left transition',
				isActive ? 'bg-white/10' : 'hover:bg-white/5',
			)}
		>
			{avatar ? (
				<img
					src={avatar}
					alt={name}
					className={cn('size-10 shrink-0 rounded-full object-cover')}
				/>
			) : (
				<div
					className={cn(
						'flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10',
						' text-[16px] text-(--color-primary)',
					)}
				>
					{name?.[0] ?? '?'}
				</div>
			)}
			<div className={cn('min-w-0 flex-1')}>
				<div className={cn('truncate text-[16px] text-(--color-primary)')}>
					{name}
				</div>
			</div>
			{unreadCount > 0 && (
				<span
					className={cn(
						'flex min-w-5 items-center justify-center rounded-full',
						' bg-blue-500 px-1.5 text-[12px] text-white',
					)}
				>
					{unreadCount}
				</span>
			)}
		</button>
	);
};
