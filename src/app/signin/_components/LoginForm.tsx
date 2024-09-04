'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginInSchema, LoginInSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginInForm() {
	const router = useRouter();
	const session = useSession();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginInSchemaType>({
		resolver: zodResolver(LoginInSchema),
	});

	const onSubmit = async (values: LoginInSchemaType) => {
		setIsLoading(true);

		try {
			const result = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
			});

			if (result?.error) {
				toast.error('User not found or incorrect credentials!');
			} else {
				await session.update();
				router.push('/');
			}
		} catch (e) {
			console.log(e);
		}
		setIsLoading(false);
	};

	return (
		<div>
			<Form {...form}>
				<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
			<Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)} className='w-full mt-6'>
				{isLoading ? <Loader2 className='animate-spin' /> : 'Log in'}
			</Button>
		</div>
	);
}
