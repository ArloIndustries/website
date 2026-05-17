'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Manifesto() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';
	const highlightClass = 'font-bold';

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>

			{/* Back Button */}
			<div className='relative z-10 pt-8 pb-4 px-6 lg:px-12'>
				<Link href='/'>
					<Button
						variant='ghost'
						className={`flex items-center gap-2 ${hoverColor} transition-colors rounded-none text-sm lg:text-base`}
					>
						<ArrowLeft className='w-4 h-4' />
						Back
					</Button>
				</Link>
			</div>

			<div className='relative z-10 flex-grow flex items-center justify-center px-6 py-16 lg:py-24'>
				<div className='max-w-4xl mx-auto text-center'>
					<h1 className='text-4xl lg:text-6xl font-bold mb-12'>MANIFESTO</h1>

					<div className='text-lg text-justify max-w-3xl mx-auto opacity-90 leading-relaxed space-y-6 pb-8 lg:pb-12'>
						<p>
							<span className={highlightClass}>Conflict is inevitable</span>. As long as there are humans, there will be disagreements. Conflict delayed is conflict multiplied. But we can make conflict concise and precise, like an educated argument instead of a bar fight.
						</p>

						<p>
							The modern battlefield has revealed a fact of survival: like in nature, the strongest species are not those with the sharpest talons or the hardest shells, but those that are most adaptable.
						</p>

						<p>
							At Arlo Industries, we draw inspiration from nature’s best defender: the <span className={highlightClass}>immune system</span>. We are building the <span className={highlightClass}>battlefield immune system</span>.
						</p>

						<p>
							We create decentralized networks of nodes that operate at the <span className={highlightClass}>tactical edge</span>. Like cells, these nodes sense, observe, and react, shifting between modes to shape what is seen and what is hidden.
						</p>

						<p>
							Machines should absorb the uncertainty, exposure, and kinetic risk of the battlefield so humans do not have to.
						</p>

						<p className='text-xl font-medium italic pt-4 text-center'>
							Or, in the words of our founder:
							<br />
							“I’d rather drone fleets falling than human lives fleeting.”
						</p>

						<p className='text-xl pt-2 text-center'>
							We are solving war from <span className={highlightClass}>first principles</span>.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
