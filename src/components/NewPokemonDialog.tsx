'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React, { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { PokemonPicker } from './PokemonPicker';
import { Switch } from './ui/switch';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePokemon } from '@/actions';
import { NewPokemonSchemaType, NewPokemonSchema } from '@/schemas';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

export function NewPokemonDialog({ trigger }: { trigger: ReactNode }) {
	const session = useSession();

	const [open, setOpen] = useState(false);
	const form = useForm<NewPokemonSchemaType>({
		resolver: zodResolver(NewPokemonSchema),
	});

	const handlePokemonChange = useCallback(
		(value: string) => {
			form.setValue('pokemonId', parseInt(value));
		},
		[form]
	);

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: CreatePokemon,
		mutationKey: ['create-pokemon'],
		onSuccess: () => {
			toast.success('Pokemon created!', {
				id: 'create-pokemon',
			});
			form.reset();
			queryClient.invalidateQueries({
				queryKey: ['pokemons'],
			});

			setOpen((prev) => !prev);
		},
	});

	const onSubmit = useCallback(
		(values: NewPokemonSchemaType) => {
			toast.loading('Creating pokemon!', {
				id: 'create-pokemon',
			});
			mutate(values);
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>New encounter!{!session.data && ' You should log in first!'}</DialogTitle>
					<DialogDescription>Get us more info about the pokemon!</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='pokemonId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pokemon</FormLabel>
									<FormControl>
										<PokemonPicker onChange={handlePokemonChange} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='givenName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pokemon name</FormLabel>
									<FormControl>
										<Input defaultValue={''} {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-2 gap-3'>
							<FormField
								control={form.control}
								name='hp'
								render={({ field }) => (
									<FormItem>
										<FormLabel>HP</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='attack'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ATK</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='defense'
								render={({ field }) => (
									<FormItem>
										<FormLabel>DEF</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='special-attack'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SATK</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='special-defense'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SDEF</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='speed'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SPD</FormLabel>
										<FormControl>
											<Input defaultValue={''} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='captured'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
										<div className='space-y-0.5'>
											<FormLabel className='text-base'>Captured</FormLabel>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>

				<DialogFooter className='sm:justify-end'>
					<DialogClose asChild>
						<Button
							type='button'
							variant='ghost'
							onClick={() => {
								form.reset();
							}}
						>
							Cancel
						</Button>
					</DialogClose>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<Button
										className='w-full h-full'
										onClick={form.handleSubmit(onSubmit)}
										disabled={isPending || !session.data}
									>
										{isPending ? <Loader2 className='animate-spin' /> : !session.data ? 'Create ⓘ' : 'Create'}
									</Button>
								</span>
							</TooltipTrigger>
							{!session.data && (
								<TooltipContent>
									<p>You must log in first!</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
