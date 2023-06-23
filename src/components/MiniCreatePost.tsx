'use client';

import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { UserAvatar } from './UserAvatar';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ImageIcon, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <li className='overflow-hidden rounded-md bg-white shadow'>
      <div className='h-full px-6 py-4 flex justify-between gap-6'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          {/* Add animation to our span like it's pulsing */}
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
            className='absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white'
          />
        </div>
        <Input
          readOnly
          onClick={() => router.push(pathName + '/submit')}
          placeholder='Create Post'
        />
        <Button
          onClick={() => router.push(pathName + '/submit')}
          variant='ghost'
        >
          <ImageIcon className='text-zinc-600' />
        </Button> 

        <Button
          onClick={() => router.push(pathName + '/submit')}
          variant='ghost'
        >
          {' '}
          <Link2 className='text-zinc-600' />{' '}
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
