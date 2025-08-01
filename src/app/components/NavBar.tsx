'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const NavBar = () => {
  // useSession() -> hook do próprio react para trabalhar com sessions
  // esse hook acessa o objeto context  que é passado durante a session provider
  // |-> estudar React Context**
  // ele retorna um objeto com algumas propriedades:
  const { status, data: session} = useSession();
  // nesse caso, estou alterando a propriedade data para ter o nome session



  return (
    <div className='bg-sky-800'>
      { status === 'authenticated' &&
        <div>
        {session.user!.name}
        { <Link href="/api/auth/signout" className='ml-3'>Sign Out</Link>}
        </div>
      }
      { status === 'loading' && <span className="loading loading-ring loading-md"></span>}
      { status === 'unauthenticated' && <Link href="/api/auth/signin">Login</Link>}
    </div>
  )
}

export default NavBar