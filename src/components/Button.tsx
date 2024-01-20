import { ReactNode, useContext } from "react"
import { ThemeContext } from "./ThemeContext"

type Button_Props = {
  className?: string,
  children: ReactNode,
  disabled?: boolean,
  onClick?: () => void,
  htmlType?: "submit" | "reset" | "button",
  type?: "primary" | "secondary",
}

export const Button = ({ className = "", children, disabled = false, type, htmlType, onClick = () => undefined }: Button_Props) => {
  const { theme } = useContext(ThemeContext)
  const defaultClasses = `text-${theme}-primary`
  const typeClasses = type === "secondary" ? `bg-none text-${theme}-secondary border-2 border-${theme}-secondary hover:border-${theme}-accentOne hover:text-${theme}-accentOne` : `hover:bg-${theme}-accentOne bg-${theme}-secondary`
  const enabledStateClasses = disabled ? `opacity-50 cursor-not-allowed` : `focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`
  const computedClasses = `${defaultClasses} ${typeClasses} ${enabledStateClasses}`
  return <button
    className={`${computedClasses} ${className}`}
    onClick={onClick}
    type={htmlType}
  >
    {children}
  </button>
}