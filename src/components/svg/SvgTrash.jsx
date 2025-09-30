import * as React from "react"

function SvgTrash(props) {
  return (
    <svg
      height={512}
      viewBox="0 0 64 64"
      width={512}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height={7.44} rx={2} width={43.18} x={10.41} y={9.35} />
      <path d="M39.88 7.35a3.048 3.048 0 00-3-3.35h-9.5a3.042 3.042 0 00-3 3.35zM13.3 18.79l1.36 35.44a5.985 5.985 0 006 5.77h22.69a5.99 5.99 0 006-5.76l1.42-35.45z" />
    </svg>
  )
}

export default SvgTrash
