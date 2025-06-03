import React from 'react'

import { clsxm } from '@/utils'

import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const Button = ({ children, variant = 'primary', ...rest }: Props): JSX.Element => {
  return (
    <button
      className={clsxm(styles[variant])}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
