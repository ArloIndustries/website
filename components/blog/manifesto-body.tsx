type ManifestoBodyProps = {
	highlightClass: string;
};

export default function ManifestoBody({ highlightClass }: ManifestoBodyProps) {
	return (
		<div className='text-lg text-justify max-w-3xl mx-auto opacity-90 leading-relaxed space-y-6 pb-8 lg:pb-12'>
			<p>
				<span className={highlightClass}>Conflict is inevitable</span>. As long
				as there are humans, there will be disagreements. Conflict delayed is
				conflict multiplied. But we can make conflict concise and precise, like
				an educated argument instead of a bar fight.
			</p>

			<p>
				The modern battlefield has revealed a fact of survival: like in nature,
				the strongest species are not those with the sharpest talons or the
				hardest shells, but those that are most adaptable.
			</p>

			<p>
				At Arlo Industries, we draw inspiration from nature’s best defender: the{' '}
				<span className={highlightClass}>immune system</span>. We are building
				the <span className={highlightClass}>battlefield immune system</span>.
			</p>

			<p>
				We create decentralized networks of nodes that operate at the{' '}
				<span className={highlightClass}>tactical edge</span>. Like cells, these
				nodes sense, observe, and react, shifting between modes to shape what is
				seen and what is hidden.
			</p>

			<p>
				Machines should absorb the uncertainty, exposure, and kinetic risk of the
				battlefield so humans do not have to.
			</p>

			<p className='text-xl font-medium italic pt-4 text-center'>
				Or, in the words of our founder:
				<br />
				“I’d rather drone fleets falling than human lives fleeting.”
			</p>

			<p className='text-xl pt-2 text-center'>
				We are solving war from{' '}
				<span className={highlightClass}>first principles</span>.
			</p>
		</div>
	);
}
