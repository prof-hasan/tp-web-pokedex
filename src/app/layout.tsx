import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootProviders from '@/components/providers/RootProvider';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { auth, BASE_PATH } from '@/auth';
import Header from '@/components/ui/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pokédex',
	description: 'A Pokédex web app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	return (
		<html lang='en'>
			<body className={inter.className}>
				<SessionProvider basePath={BASE_PATH} session={session}>
					<RootProviders>
						<Header />
						{children}
					</RootProviders>
				</SessionProvider>
				<Toaster richColors position='bottom-right' />
			</body>
		</html>
	);
}
