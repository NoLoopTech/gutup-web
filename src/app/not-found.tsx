import Link from "next/link"

export const metadata = {
  title: {
    default: "Page Not Found"
  },
  description: "Welcome to GutUp Admin Panel!"
}

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
