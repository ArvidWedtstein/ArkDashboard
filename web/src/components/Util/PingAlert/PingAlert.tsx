interface IPingAlert {
  color?: String
}
export const PingAlert = ({ color = "bg-pink-500", }: IPingAlert) => {
  return (
    <span className="flex absolute -mt-5 ml-4">
      <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${color.replace(/^\d+$/, (Number(color.split("-")[2]) - 100).toString())} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}>
      </span>
    </span>
  )
}

