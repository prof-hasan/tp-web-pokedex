'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignUpSchema, SignUpSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignUp() {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
	});

	const onSubmit = async (values: SignUpSchemaType) => {
		setIsLoading(true);

		const result = await fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify(values),
		}).then((res) => res.json());

		if (result.errorMessage) {
			if (result.errorMessage.name === 'LibsqlError') {
				toast.error('Duplicated emails, please use another');
			} else {
				toast.error('An error has occured');
			}
		} else {
			await signIn('credentials', {
				email: values.email,
				password: values.password,
				callbackUrl: '/',
			});
		}

		setIsLoading(false);
	};
	return (
		<main className='flex min-h-screen flex-col items-center justify-between lg:p-24 p-6 bg-pokeRed'>
			<Card>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl'>Create your account</CardTitle>
					<CardDescription>Enter your email below to create your account</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<div>
						<Form {...form}>
							<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input defaultValue={''} {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input defaultValue={''} placeholder='m@example.com' {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input defaultValue={''} type='password' {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</form>
						</Form>
						<Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className='w-full mt-6'>
							{isLoading ? <Loader2 className='animate-spin' /> : 'Sign up'}
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
