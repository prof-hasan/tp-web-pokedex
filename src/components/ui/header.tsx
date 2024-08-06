import React from 'react';
import { CircleUser } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './dropdown-menu';
import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { ThemeSwitcherButton } from '../ThemeSwitcherButton';

const Header = async () => {
    const session = await auth();

    return (
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 py-3 px-4 lg:h-[60px] lg:px-6">
            <div className="flex gap-2 items-center justify-center font-bold text-3xl dark:text-primary text-red-500">
                <Link className='flex items-center gap-2' href={'/'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" viewBox="0 0 24 24" width="24">
                        <path
                            d="M21.9012 13H16.8506C16.3873 15.2822 14.3696 17 11.9506 17C9.53167 17 7.51391 15.2822 7.05064 13H2C2.50172 18.0533 6.76528 22 11.9506 22C17.136 22 21.3995 18.0533 21.9012 13Z"
                            className="fill-primary"
                        />
                        <path
                            d="M21.9012 11C21.3995 5.94668 17.136 2 11.9506 2C6.76528 2 2.50172 5.94668 2 11H7.05064C7.51391 8.71776 9.53167 7 11.9506 7C14.3696 7 16.3873 8.71776 16.8506 11H21.9012Z"
                            className="fill-primary"
                        />
                        <path
                            clipRule="evenodd"
                            d="M11.9506 15C13.6075 15 14.9506 13.6569 14.9506 12C14.9506 10.3431 13.6075 9 11.9506 9C10.2938 9 8.95062 10.3431 8.95062 12C8.95062 13.6569 10.2938 15 11.9506 15ZM13.4506 12C13.4506 12.8284 12.7791 13.5 11.9506 13.5C11.1222 13.5 10.4506 12.8284 10.4506 12C10.4506 11.1716 11.1222 10.5 11.9506 10.5C12.7791 10.5 13.4506 11.1716 13.4506 12Z"
                            className="fill-primary"
                            fillRule="evenodd"
                        />
                    </svg>
                    Pokedéx
                </Link>
            </div>
            <div className="flex gap-2 items-center">
                <Button variant={'ghost'}><Link href='/social'>
                Social</Link></Button>
                <Button asChild variant={'ghost'}><Link href='/pokemon/1'>
                Explore</Link></Button>
                <ThemeSwitcherButton />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage src={session?.user.image ?? undefined} />
                                <AvatarFallback>
                                    {session?.user.name ? session.user.name[0].toUpperCase() : <CircleUser />}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {session ? (
                            <DropdownMenuItem>
                                <Link className="w-full" href={'/api/auth/signout'}>
                                    Sign out
                                </Link>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                <Link className="w-full" href={'/signin'}>
                                    Sign in
                                </Link>{' '}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
