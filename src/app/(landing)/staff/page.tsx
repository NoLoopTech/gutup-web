import Link from 'next/link'
import UserProfile from './UserProfile'

export default async function Staff (): Promise<JSX.Element> {
  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        <h1 className='leading-loose text-[15rem] font-extrabold text-accent'>Staff</h1>
      </div>
      <div>
        <UserProfile />
        <Link href='/about' className='btn btn-primary'>About Us</Link>
      </div>
    </div>
  )
}
