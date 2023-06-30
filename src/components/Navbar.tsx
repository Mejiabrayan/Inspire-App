import Link from 'next/link';
import React from 'react';
import { buttonVariants } from './ui/Button';
import { UserAccountNav } from './UserAccountNav';
import SearchBar from './SearchBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
          <p className='hidden text-sm font-bold md:block bg-gradient-to-r text-transparent bg-clip-text from-slate-800 to-gray-600'>
            Inspire
          </p>{' '}
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
