import Link from "next/link"

export default async function Contact(): Promise<JSX.Element> {
  return (
    <div className="grid grid-cols-2 text-white p-4">
      <div>
        <h1 className="leading-loose text-[15rem] font-extrabold text-accent">
          Contact us
        </h1>
      </div>
      <div>
        <Link href="/about" className="btn btn-primary me-4">
          About Us
        </Link>
        <Link href="/staff" className="btn btn-primary">
          Staff
        </Link>
      </div>
    </div>
  )
}
