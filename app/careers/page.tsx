'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const roles = [
	{
		title: 'Founding Distributed Systems & Embedded Engineer',
		subtitle: '(Networking / Mesh focus)',
		roleOverview:
			'Design and build resilient, decentralized communication systems that operate in constrained and unreliable environments. This role spans hardware, firmware, and network behavior under real-world conditions.',
		responsibilities: [
			'Build and optimize software for distributed edge devices',
			'Design decentralized networking architectures (ad hoc / peer-to-peer systems)',
			'Ensure reliable data transfer across constrained links (low bandwidth, intermittent connectivity)',
			'Integrate communication hardware and validate system-level performance',
			'Conduct field testing and iterate based on real-world behavior',
		],
		requirements: [
			'Strong systems engineering ability across hardware and software boundaries',
			'Experience designing or working with distributed or networked systems',
			'Understanding of wireless communication tradeoffs (range, power, reliability)',
			'Ability to debug across multiple layers of a system',
			'Track record of building and shipping real-world systems',
		],
		profileFit: [
			'Prioritizes working systems over perfect abstractions',
			'Comfortable operating with incomplete information',
			'Moves quickly from prototype to field validation',
		],
	},
	{
		title: 'Founding Perception & Applied Physics Engineer',
		subtitle: '(Optical / sensing / spatial reconstruction focus)',
		roleOverview:
			'Develop systems that extract structured information from noisy, real-world signals. This role sits at the intersection of physics, geometry, and computation.',
		responsibilities: [
			'Design algorithms for extracting signal from noisy sensor data',
			'Work with multi-sensor inputs to estimate spatial relationships and motion',
			'Build models for interpreting real-world signals under uncertainty',
			'Optimize processing for constrained, edge environments',
			'Validate performance across varying environmental conditions',
		],
		requirements: [
			'Strong foundation in physics, applied mathematics, or perception systems',
			'Experience with signal processing, estimation, or spatial reasoning',
			'Ability to translate theoretical models into robust implementations',
			'Familiarity with real-world sensor noise and imperfect data',
			'Experience working on end-to-end systems, not just isolated models',
		],
		niceToHave: [
			'Exposure to multi-sensor systems or spatial reconstruction problems',
			'Background in imaging systems, optics, or environmental sensing',
		],
		profileFit: [
			'Thinks from first principles',
			'Comfortable operating without clean data or controlled environments',
		],
	},
	{
		title: 'Forward Deployed Growth & Operations Lead',
		subtitle: '(Global GTM / field ops)',
		roleOverview:
			'Drive adoption of early-stage, high-performance systems across both commercial (dual-use) and government/defense environments. This role combines field deployment, business development, and navigation of complex regulatory landscapes across regions.',
		responsibilities: [
			'Identify and secure pilot deployments across dual-use and defense contexts',
			'Operate in the field to validate system performance with real users and environments',
			'Translate technical capabilities into clear operational value for commercial and institutional stakeholders',
			'Manage cross-border sales processes, including partnerships, intermediaries, and local operators',
			'Navigate regulatory and compliance requirements for international deployment (export controls, end-use considerations, etc.)',
			'Build long-term relationships with early adopters across both private sector and government ecosystems',
			'Feed structured field insights back into product and engineering teams',
		],
		requirements: [
			'Experience selling or deploying technical systems in dual-use and/or defense environments',
			'Working understanding of export controls, compliance frameworks, and cross-border constraints',
			'Ability to operate across different regulatory regimes and adapt to local market dynamics',
			'Strong ownership from initial engagement through deployment and iteration',
			'Clear, structured communication across technical teams, operators, and decision-makers',
		],
		niceToHave: [
			'Experience with government procurement, defense programs, or regulated commercial sectors',
			'Background working in international markets with complex stakeholder environments',
			'Familiarity with early-stage or deep tech companies',
		],
		profileFit: [
			'Operates effectively across commercial and defense contexts without friction',
			'Understands how to position the same system differently depending on user and environment',
			'Balances speed of execution with regulatory and geopolitical awareness',
			'Comfortable being deployed in the field as needed',
		],
	},
];

export default function Careers() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	const [openRoleIndex, setOpenRoleIndex] = useState<number | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';
	const borderColor = isDark ? 'border-red-900' : 'border-red-800';
	const cardBg = isDark ? 'bg-black/50' : 'bg-red-500/10';

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>

			{/* Back Button */}
			<div className='relative z-20 pt-8 pb-4 px-6 lg:px-12'>
				<Link href='/'>
					<Button
						variant='ghost'
						className={`flex items-center gap-2 ${hoverColor} transition-colors rounded-none text-sm lg:text-base pl-0 hover:bg-transparent`}
					>
						<ArrowLeft className='w-4 h-4' />
						BACK
					</Button>
				</Link>
			</div>

			<div className='relative z-10 flex-grow flex flex-col items-center px-6 py-8 lg:py-16'>
				<div className='max-w-5xl w-full mx-auto'>
					<h1 className='text-4xl lg:text-6xl font-black mb-16 text-center tracking-tight'>
						JOIN THE MISSION
					</h1>

					<div className='grid gap-12'>
						{roles.map((role, idx) => (
							<div
								key={idx}
								className={`group relative p-8 border ${borderColor} ${cardBg} backdrop-blur-sm hover:border-red-500/50 transition-all duration-300`}
							>
								{/* Corner Accents */}
								<div className='absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50' />
								<div className='absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-50' />
								<div className='absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-50' />
								<div className='absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50' />

								<div className='space-y-6'>
									<button
										type='button'
										onClick={() =>
											setOpenRoleIndex((prev) => (prev === idx ? null : idx))
										}
										className='w-full flex items-start justify-between gap-4 text-left'
										aria-expanded={openRoleIndex === idx}
									>
										<div>
											<h2 className='text-2xl lg:text-3xl font-bold uppercase tracking-wide mb-1'>
												{role.title}
											</h2>
											{role.subtitle && (
												<p className='text-sm lg:text-base opacity-70 font-mono'>
													{role.subtitle}
												</p>
											)}
										</div>
										{openRoleIndex === idx ? (
											<ChevronUp className='w-6 h-6 shrink-0 mt-1 opacity-80' />
										) : (
											<ChevronDown className='w-6 h-6 shrink-0 mt-1 opacity-80' />
										)}
									</button>

									{openRoleIndex === idx && (
										<div className='flex flex-col lg:flex-row gap-8 lg:items-start justify-between'>
											<div className='flex-1 space-y-6'>
												<div>
													<h3 className='font-bold mb-3 uppercase text-sm tracking-wider opacity-70'>
														Role Overview
													</h3>
													<p className='text-base opacity-90 leading-relaxed max-w-3xl'>
														{role.roleOverview}
													</p>
												</div>

												<div className='grid md:grid-cols-2 gap-8 pt-2'>
													<div>
														<h3 className='font-bold mb-3 uppercase text-sm tracking-wider opacity-70'>
															Responsibilities
														</h3>
														<ul className='space-y-2 text-sm opacity-80'>
															{role.responsibilities.map((item, i) => (
																<li key={i} className='flex gap-2 items-start'>
																	<span className='mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0' />
																	<span>{item}</span>
																</li>
															))}
														</ul>
													</div>
													<div>
														<h3 className='font-bold mb-3 uppercase text-sm tracking-wider opacity-70'>
															Requirements
														</h3>
														<ul className='space-y-2 text-sm opacity-80'>
															{role.requirements.map((item, i) => (
																<li key={i} className='flex gap-2 items-start'>
																	<span className='mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0' />
																	<span>{item}</span>
																</li>
															))}
														</ul>
													</div>
												</div>

												{role.niceToHave && (
													<div>
														<h3 className='font-bold mb-3 uppercase text-sm tracking-wider opacity-70'>
															Nice to Have
														</h3>
														<ul className='space-y-2 text-sm opacity-80'>
															{role.niceToHave.map((item, i) => (
																<li key={i} className='flex gap-2 items-start'>
																	<span className='mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0' />
																	<span>{item}</span>
																</li>
															))}
														</ul>
													</div>
												)}

												<div>
													<h3 className='font-bold mb-3 uppercase text-sm tracking-wider opacity-70'>
														Profile Fit
													</h3>
													<ul className='space-y-2 text-sm opacity-80'>
														{role.profileFit.map((item, i) => (
															<li key={i} className='flex gap-2 items-start'>
																<span className='mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0' />
																<span>{item}</span>
															</li>
														))}
													</ul>
												</div>
											</div>

											<div className='lg:ml-8 flex-shrink-0 pt-2'>
												<a
													href='https://www.ycombinator.com/companies/arlo-industries'
													target='_blank'
													rel='noopener noreferrer'
													className='inline-block'
												>
													<Button
														variant='outline'
														className={`h-auto py-3 px-8 text-lg font-bold uppercase tracking-wider border-2 ${
															isDark
																? 'hover:bg-red-500 hover:text-black border-red-500'
																: 'hover:bg-white hover:text-black border-black'
														} transition-all duration-300 rounded-none group-hover:scale-105`}
													>
														Join
														<ArrowUpRight className='ml-2 w-5 h-5' />
													</Button>
												</a>
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
