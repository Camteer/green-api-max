import { GreenApiChat } from '@/app/api/chats/types';
import { ChatCard } from '@/components/ChatCard';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';

interface ChatContentProps {
	name?: string;
	chats: GreenApiChat[];
	activeChatId?: string | null;
	query: string;
	onQueryChange: (value: string) => void;
	onSelectChat: (chat: GreenApiChat) => void;
	onSearchPhone?: () => void;
	onOpenPhoneModal: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
	name = 'Чаты',
	chats,
	activeChatId,
	query,
	onQueryChange,
	onSelectChat,
	onSearchPhone,
	onOpenPhoneModal,
}) => {
	return (
		<div
			className={cn(
				'flex h-full flex-col items-center',
				'text-(--color-primary) font-normal text-[12px]',
			)}
		>
			<div className={cn('flex w-full justify-between p-4')}>
				<h1 className={cn('font-bold text-[24px]')}>{name}</h1>
				<button
					type="button"
					onClick={onOpenPhoneModal}
					className={cn(
						'flex h-8 w-8 aspect-square items-center justify-center rounded-[45%] bg-blue-500',
					)}
				>
					<Plus />
				</button>
			</div>
			<div className={cn('flex w-full flex-col px-4')}>
				<input
					className={cn(
						'h-9 w-full rounded-xl border-none p-4 outline-none',
						'color-(--color-primary) bg-[#ffffff17] text-[16px]',
					)}
					type="text"
					placeholder="Найти"
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							onSearchPhone?.();
						}
					}}
				/>
			</div>
			<div
				className={cn(
					'mt-2 flex w-full flex-1 flex-col overflow-y-auto px-2 pb-4',
				)}
			>
				{chats.map((chat) => (
					<ChatCard
						key={chat.chatId}
						name={chat.name || chat.chatId}
						avatar={chat.avatar}
						unreadCount={chat.unreadCount}
						isActive={activeChatId === chat.chatId}
						onClick={() => onSelectChat(chat)}
					/>
				))}
			</div>
		</div>
	);
};
