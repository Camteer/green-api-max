'use client';

import { ActiveChat } from '@/components/ActiveChat';
import { ChatContent } from '@/components/ChatContent';
import { NavItem } from '@/components/NavItem';
import { PhoneSearchModal } from '@/components/PhoneSearchModal';
import { cn } from '@/utils/cn';
import {
	Folder,
	MessageSquareMore,
	Phone,
	Settings,
	UserGroup,
} from 'lucide-react';
import { ReactElement, useEffect, useMemo, useState, useRef } from 'react';

import { GreenApiChat } from './api/chats/types';
import { GreenApiMessage } from './api/message/types';
import { checkAccount, getChats } from './api/chats/methods';
import {
	deleteNotification,
	getChatHistory,
	receiveNotification,
	sendMessage,
} from './api/message/methods';

interface INavItems {
	id: string;
	icon: ReactElement;
	name: string;
}

type ChatWithContact = GreenApiChat & {
	avatar?: string;
};

export default function Home() {
	const [activeItem, setActiveItem] = useState('all');
	const [chats, setChats] = useState<ChatWithContact[]>([]);
	const [activeChat, setActiveChat] = useState<ChatWithContact | null>(null);
	const [messages, setMessages] = useState<GreenApiMessage[]>([]);
	const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [draft, setDraft] = useState('');

	const navItems: INavItems[] = [
		{ id: 'all', icon: <MessageSquareMore />, name: 'Все' },
		{ id: 'folder1', icon: <Folder />, name: 'Новые' },
		{ id: 'folder2', icon: <Folder />, name: 'Каналы' },
		{ id: 'users', icon: <UserGroup />, name: 'Контакты' },
		{ id: 'phone', icon: <Phone />, name: 'Звонки' },
		{ id: 'settings', icon: <Settings />, name: 'Настройки' },
	];

	const handleNavClick = (id: string) => {
		setActiveItem(id);
	};

	const activeChatRef = useRef<GreenApiChat | null>(null);

	useEffect(() => {
		activeChatRef.current = activeChat;
	}, [activeChat]);

	const filteredChats = useMemo(() => {
		const value = query.trim().toLowerCase();

		if (!value) {
			return chats;
		}

		return chats.filter((chat) => {
			return (
				chat.name.toLowerCase().includes(value) ||
				chat.chatId.includes(value) ||
				String(chat.phoneNumber || '').includes(value)
			);
		});
	}, [chats, query]);

	useEffect(() => {
		async function loadChats() {
			try {
				const response = await getChats();

				if (!response) {
					return;
				}

				setChats(response);
			} catch (error) {
				console.error('Failed to load chats:', error);
			}
		}

		loadChats();
	}, []);

	useEffect(() => {
		let stopped = false;

		async function receiveLoop() {
			while (!stopped) {
				try {
					const notification = await receiveNotification();

					if (!notification) {
						continue;
					}

					const body = notification.body;

					if (
						body.typeWebhook === 'incomingMessageReceived' ||
						body.typeWebhook === 'outgoingMessageReceived'
					) {
						const message: GreenApiMessage = {
							type:
								body.typeWebhook === 'outgoingMessageReceived'
									? 'outgoing'
									: 'incoming',
							idMessage: body.idMessage,
							timestamp: body.timestamp,
							chatId: body.senderData.chatId,
							textMessage: body.messageData.textMessageData?.textMessage ?? '',
						};

						if (activeChatRef.current?.chatId === message.chatId) {
							setMessages((current) => [...current, message]);
						}

						setChats((current) =>
							current.map((chat) =>
								chat.chatId === message.chatId
									? {
											...chat,
											unreadCount: (chat.unreadCount ?? 0) + 1,
										}
									: chat,
							),
						);
					}

					await deleteNotification(notification.receiptId);
				} catch (error) {
					console.error('Failed to receive notification:', error);

					await new Promise((resolve) => setTimeout(resolve, 5000));
				}
			}
		}

		receiveLoop();

		return () => {
			stopped = true;
		};
	}, []);

	useEffect(() => {
		if (!activeChat) {
			setMessages([]);
			return;
		}

		async function loadMessages() {
			try {
				const response = await getChatHistory(activeChat!.chatId, 100);

				setMessages([...response].reverse());
			} catch (error) {
				console.error('Failed to load chat history:', error);
				setMessages([]);
			}
		}

		loadMessages();
	}, [activeChat]);

	async function handleSearchPhone(phoneNumber: number) {
		try {
			const data = await checkAccount(phoneNumber);

			if (!data.exist || !data.chatId) {
				return;
			}

			const existing = chats.find((chat) => chat.chatId === data.chatId);

			const nextChat: GreenApiChat = existing ?? {
				chatId: data.chatId,
				name: `+${phoneNumber}`,
				type: 'user',
				phoneNumber,
			};

			if (!existing) {
				setChats((current) => [nextChat, ...current]);
			}

			setActiveChat(nextChat);
			setIsPhoneModalOpen(false);
		} catch (error) {
			console.error('Failed to search phone:', error);
		}
	}

	const handleSendMessage = async () => {
		if (!activeChat || !draft.trim()) {
			return;
		}

		const text = draft.trim();

		try {
			const response = await sendMessage(activeChat.chatId, text);

			setMessages((current) => [
				...current,
				{
					type: 'outgoing',
					idMessage: response.idMessage,
					timestamp: Math.floor(Date.now() / 1000),
					chatId: activeChat.chatId,
					textMessage: text,
				},
			]);

			setDraft('');
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	return (
		<div
			className={cn(
				'relative flex h-screen w-full flex-col min-[926px]:flex-row',
			)}
		>
			<nav
				className={cn(
					'bg-background z-20 border-(--border-color)',
					'fixed bottom-0 left-0 h-16 w-full',
					'min-[926px]:static min-[926px]:h-screen min-[926px]:w-19.25',
					'min-[926px]:border-r min-[926px]:border-t-0',
				)}
			>
				<div className="flex h-full w-full items-center justify-around min-[926px]:hidden">
					{navItems.map((navItem) => (
						<NavItem
							key={navItem.id}
							name={navItem.name}
							icon={navItem.icon}
							isActive={activeItem === navItem.id}
							onClick={() => handleNavClick(navItem.id)}
						/>
					))}
				</div>

				<div className="hidden h-full w-full flex-col min-[926px]:flex">
					<div className="relative flex w-full flex-col gap-6 px-1 pt-6">
						{navItems.slice(0, -3).map((navItem) => (
							<NavItem
								key={navItem.id}
								name={navItem.name}
								icon={navItem.icon}
								isActive={activeItem === navItem.id}
								onClick={() => handleNavClick(navItem.id)}
							/>
						))}
					</div>

					<div className="mx-3 my-3 border-[0.5px] border-white opacity-30" />

					<div className="flex flex-1 flex-col justify-between">
						<div className="flex flex-col gap-6">
							{navItems.slice(-3, -1).map((navItem) => (
								<NavItem
									key={navItem.id}
									name={navItem.name}
									icon={navItem.icon}
									isActive={activeItem === navItem.id}
									onClick={() => handleNavClick(navItem.id)}
								/>
							))}
						</div>

						<div className="pb-6">
							{navItems.slice(-1).map((navItem) => (
								<NavItem
									key={navItem.id}
									name={navItem.name}
									icon={navItem.icon}
									isActive={activeItem === navItem.id}
									onClick={() => handleNavClick(navItem.id)}
								/>
							))}
						</div>
					</div>
				</div>
			</nav>
			<aside
				className={cn(
					'bg-background z-10 flex h-screen w-98.25 flex-col gap-6 border-r border-(--border-color)',
					'max-[925px]:h-[calc(100vh-4rem)] max-[925px]:w-full max-[925px]:border-r-0 max-[925px]:pb-16',
				)}
			>
				<ChatContent
					chats={filteredChats}
					activeChatId={activeChat?.chatId}
					query={query}
					onQueryChange={setQuery}
					onSelectChat={(chat) => {
						setActiveChat(chat);
						setChats((current) =>
							current.map((item) =>
								item.chatId === chat.chatId
									? { ...item, unreadCount: 0 }
									: item,
							),
						);
					}}
					onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
				/>
			</aside>
			<main
				className={cn(
					'min-w-0 flex-1',
					activeChat &&
						'max-[925px]:fixed max-[925px]:inset-0 max-[925px]:z-30 max-[925px]:h-[calc(100vh-4rem)]',
				)}
			>
				{activeChat ? (
					<ActiveChat
						chat={activeChat}
						messages={messages}
						draft={draft}
						onDraftChange={setDraft}
						onSend={handleSendMessage}
						onClose={() => {
							setActiveChat(null);
						}}
					/>
				) : null}
			</main>
			<PhoneSearchModal
				isOpen={isPhoneModalOpen}
				onClose={() => setIsPhoneModalOpen(false)}
				onSearch={handleSearchPhone}
			/>
		</div>
	);
}
