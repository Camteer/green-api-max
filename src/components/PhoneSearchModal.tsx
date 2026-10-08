'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { formatPhone } from '@/utils/utils';

interface PhoneSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSearch: (phoneNumber: number) => void;
}

export const PhoneSearchModal = ({
	isOpen,
	onClose,
	onSearch,
}: PhoneSearchModalProps) => {
	const [phone, setPhone] = useState('');

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);
  
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!mounted || !isOpen) {
		return null;
	}

	const digits = phone.replace(/\D/g, '');
	const isValid = digits.length === 11;

	const handleSearch = () => {
		if (!isValid) {
			return;
		}

		onSearch(Number(digits));
		setPhone('');
	};

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div
				className={cn(
					'w-full max-w-[420px] rounded-2xl',
					'bg-background p-5 shadow-2xl',
				)}
			>
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-[20px] font-semibold text-(--color-primary)">
						Найти по номеру
					</h2>
				</div>

				<input
					type="tel"
					inputMode="numeric"
					placeholder="+7 800 555 35 35"
					value={phone}
					onChange={(event) => {
						setPhone(formatPhone(event.target.value));
					}}
					className={cn(
						'h-11 w-full rounded-xl bg-[#ffffff17] px-4',
						'text-[16px] text-(--color-primary)',
						'outline-none placeholder:text-white/30',
						isValid && 'ring-1 ring-blue-500',
					)}
				/>

				<button
					type="button"
					disabled={!isValid}
					onClick={handleSearch}
					className={cn(
						'mt-5 h-11 w-full rounded-xl text-[15px] font-medium transition',
						isValid
							? 'bg-blue-500 text-white hover:bg-blue-600'
							: 'cursor-not-allowed bg-white/10 text-white/30',
					)}
				>
					Найти в MAX
				</button>
			</div>
		</div>,
		document.body,
	);
};
