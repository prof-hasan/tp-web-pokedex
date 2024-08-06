'use client';

import { ThemeProvider } from 'next-themes';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 60 * 1000 * 10,
		},
	},
});

function RootProviders({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default RootProviders;
