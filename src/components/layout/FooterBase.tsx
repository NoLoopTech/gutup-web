import { languages } from '@/i18n/settings'
import Link from 'next/link'

interface Props {
  t: any
  lng: string
}

export const FooterBase = ({ t, lng }: Props): JSX.Element => {
  return (
    <footer style={{ marginTop: 50 }}>
      {languages.filter((l) => lng !== l).map((l, index) => {
        return (
          <span key={l}>
            Change language to&nbsp;
            {index > 0 && (' or ')}
            <Link href={`/${l}/staff`} prefetch={false} className='underline'>
              {l}
            </Link>
          </span>
        )
      })}
    </footer>
  )
}
