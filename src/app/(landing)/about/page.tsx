import Link from 'next/link'

export default async function About (): Promise<JSX.Element> {
  /**
   * `cache: no-store` means that the request will be called on every page load (in contrast to being cached during build time)
   * To check the difference, simply load the page by itself (by entering the URL in the browser) - the page will take more than 20s
   * to load.
   *
   * Compare this with when the `/contact` page is loaded and check the network inspector. Since there is a `<Link>` to the about page,
   * the About page is cached in the background. i.e. if the user stays on the contact page for 20s, the actual page navigation will be instant
   * because the page has already been loaded in the background
   */
  const r = await fetch(
    'https://hub.dummyapis.com/delay?seconds=20',
    { cache: 'no-store' }
  )
  console.log(r)
  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        <p className='text-black'>{r.text()}</p>
        <h1 className='leading-loose text-[15rem] font-extrabold text-accent'>About us</h1>
      </div>
      <div>
        <Link href='/contact' className='btn btn-primary'>Contact Us</Link>
      </div>
    </div>
  )
}
