import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import Button from './Button';
import { Icons } from './Icons';

const Header = () => {
  const { data:session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  const logout = () => {
    signOut();
  };
  const logIn = () => {
    signIn();
  }

  return (
    <div className="max-w-2xl mx-auto text-right flex justify-end p-2 gap-4 items-center">
      {isLoggedIn && (
        <>
          Hello, {session?.user?.name}
          <Button
            className='border bg-white shadow-sm px-2 py-0 '
            onClick={logout}>
            Logout <Icons.logout />
          </Button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Button
            className="border bg-white shadow-sm px-2 py-0 "
            onClick={logIn}>
            LogIn <Icons.login />
          </Button>
        </>
      )}
      
    </div>
  )
}

export default Header