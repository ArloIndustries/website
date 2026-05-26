import { permanentRedirect } from 'next/navigation';

export default function ManifestoRedirect() {
	permanentRedirect('/blog/manifesto');
}
