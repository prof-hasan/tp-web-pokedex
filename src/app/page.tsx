'use client';

import { getSvgIcon } from './utils';
import { Button } from '@/components/ui/button';
import { AArrowDown, BarChart, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Home() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.get('search');
	const sortByParam = searchParams.get('sortBy');
	const [searchString, setSearchString] = useState(search || '');
	const [sortBy, setSortBy] = useState(sortByParam || 'alphabetically');

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24 bg-red-800'>
			<div className='flex flex-col w-full gap-3'>
				<div className='flex justify-between w-full text-white'>
					<div className='flex gap-2 items-center justify-center font-bold text-3xl'>
						{getSvgIcon}
						Pokedéx
					</div>
					<Button variant='ghost' size='icon' className='rounded-full'>
						<AArrowDown />
					</Button>
				</div>
				<div className='flex flex-row gap-2 items-center justify-center'>
					<Input
						className='rounded-full'
						placeholder='Search'
						startIcon={Search}
						value={searchString}
						onChange={(ev) => {
							setSearchString(ev.target.value);
							router.push(pathname + '?' + createQueryString('search', ev.target.value));
						}}
					/>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant='outline' size='icon' className='rounded-full rotate-270 rotate-90'>
								<BarChart color='red' />
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<Card>
								<CardHeader>
									<CardTitle>Sort by:</CardTitle>
								</CardHeader>
								<CardContent className='flex flex-col gap-3'>
									<RadioGroup
										onValueChange={(ev) => {
											setSortBy(ev);
											router.push(pathname + '?' + createQueryString('sortBy', ev));
										}}
										defaultValue={sortBy}
									>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='alphabetically' id='name' />
											<Label htmlFor='name'>Name</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='number' id='number' />
											<Label htmlFor='number'>Number</Label>
										</div>
									</RadioGroup>
								</CardContent>
							</Card>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</main>
	);
}
