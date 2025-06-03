export default function Title({
  title,
  textSize = "text-2xl md:text-3xl",
  textColor = "text-primary-500",
  fontWeight = "font-semibold",
  align = "text-left"
}: {
  title: string
  textSize?: string
  textColor?: "text-primary-500" | "text-white"
  fontWeight?: "font-normal" | "font-medium" | "font-semibold" | "font-bold"
  align?: "text-left" | "text-center" | "text-right" | "text-justify"
}): JSX.Element {
  return (
    <>
      <div
        className={`${textSize} ${textColor} ${fontWeight} ${align} font-noto`}
      >
        {title}
      </div>
    </>
  )
}
