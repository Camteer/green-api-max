import { ContactInfo, GreenApiChat } from '@/app/api/chats/types';
import { GreenApiMessage } from '@/app/api/message/types';
import { cn } from '@/utils/cn';
import { getDateLabel, getMessageTime } from '@/utils/utils';
import { useRef } from 'react';
import { ArrowLeft, SendHorizontal } from 'lucide-react';

interface ActiveChatProps {
	chat: GreenApiChat;
	messages: GreenApiMessage[];
	draft: string;
	onDraftChange: (value: string) => void;
	onSend: () => void;
	onClose: () => void;
}

export const ActiveChat: React.FC<ActiveChatProps> = ({
	chat,
	messages,
	draft,
	onDraftChange,
	onSend,
	onClose,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		onSend();
	};

	return (
		<div
			className={cn('flex w-full h-screen flex-1 flex-col', 'chat-background')}
		>
			<header
				className={cn(
					'flex h-16 w-full items-center',
					'bg-background gap-3 border-b border-(--border-color) px-6',
				)}
			>
				<ArrowLeft
					className={cn(
						'text-white cursor-pointer hover:opacity-75 transition',
					)}
					onClick={onClose}
				/>
				{chat.avatar ? (
					<img
						src={chat.avatar}
						alt={chat.name}
						className={cn('size-10 rounded-full object-cover')}
					/>
				) : (
					<div
						className={cn(
							'flex size-10 items-center justify-center rounded-full bg-white/10 text-(--color-primary)',
						)}
					>
						{chat.name[0] ?? '?'}
					</div>
				)}
				<div>
					<div className={cn('text-[16px] font-medium text-(--color-primary)')}>
						{chat.name}
					</div>
				</div>
			</header>
			<div className={cn('flex flex-1 overflow-y-auto')}>
				<div
					className={cn(
						'mx-auto flex w-full max-w-175 flex-col gap-2 px-4 py-6',
					)}
				>
					{messages.map((message, index) => {
						const outgoing = message.type === 'outgoing';

						const currentDate = new Date(
							message.timestamp * 1000,
						).toDateString();

						const previousDate =
							index > 0
								? new Date(messages[index - 1].timestamp * 1000).toDateString()
								: null;

						const showDate = currentDate !== previousDate;

						return (
							<div key={message.idMessage}>
								{showDate && (
									<div className={cn('my-4 flex justify-center')}>
										<span
											className={cn(
												'rounded-lg bg-white/10 px-3 py-1 text-[12px] text-white/70',
											)}
										>
											{getDateLabel(message.timestamp)}
										</span>
									</div>
								)}

								<div
									className={cn(
										'flex',
										outgoing ? 'justify-end' : 'justify-start',
									)}
								>
									<div
										className={cn(
											'max-w-125 wrap-break-word rounded-2xl px-4 py-2 text-[15px] text-(--color-primary)',
											outgoing ? 'bg-blue-600' : 'bg-white/10',
										)}
									>
										<div className={cn('flex items-end gap-2')}>
											<span>{message.textMessage}</span>

											<span
												className={cn('shrink-0 text-[11px] text-white/50')}
											>
												{getMessageTime(message.timestamp)}
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<form onSubmit={handleSubmit} className=" p-4">
				<div className={cn('mx-auto flex w-full max-w-175 gap-3')}>
					<textarea
						ref={textareaRef}
						rows={1}
						value={draft}
						onChange={(event) => {
							const textarea = event.currentTarget;

							onDraftChange(textarea.value);

							textarea.style.height = 'auto';
							textarea.style.height = `${Math.min(textarea.scrollHeight, 8 * 24 + 16)}px`;
						}}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault();
								onSend();
							}
						}}
						placeholder="Сообщение"
						className={cn(
							'max-h-52 min-h-11 flex-1',
							'resize-none overflow-y-auto rounded-xl bg-[#ffffff17] px-4 py-3',
							' text-[16px] leading-6 text-(--color-primary) outline-none',
						)}
					/>
					<button
						type="submit"
						disabled={!draft.trim()}
						className={cn(
							'flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white',
							'transition-all duration-200',
							draft.trim()
								? 'scale-100 opacity-100'
								: 'pointer-events-none scale-75 opacity-0',
						)}
					>
						<SendHorizontal className="size-5" />
					</button>
				</div>
			</form>
		</div>
	);
};
