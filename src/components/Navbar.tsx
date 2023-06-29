import Link from 'next/link';
import React from 'react';
import { Icons } from './Icons';
import { buttonVariants } from './ui/Button';
import { getAuthSession } from '@/lib/auth';
import { UserAccountNav } from './UserAccountNav';

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className='fixed top-0 inset-x-0 h-16 bg-gray-100 border-b border-gray-300 z-10'>
      <div className='container mx-auto h-full flex items-center justify-between'>
        {/* logo */}
        <Link href='/' className='flex items-center'>
          {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6 mr-2 px-5' />{' '} */}
          <p className='hidden text-sm font-bold md:block bg-gradient-to-r text-transparent bg-clip-text from-slate-800 to-gray-600'>
            Inspire
          </p>
        </Link>
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
