import Link from "next/link"

export const ACESHeader = () => {
  return (
    <div className="flex flex-col mb-2 space-y-6 header">
      <div className="flex items-center justify-center">
        <Link href="https://aces-rmdssoe.tech">
          <img
            src="https://res.cloudinary.com/dygc8r0pv/image/upload/v1734452294/ACES_Logo_ACE_White_d6rz6a.png"
            alt="ACES Logo"
            className="w-[7em] h-[7em] rounded-[50%] mt-3"
          />
        </Link>
      </div>
      <h1 className="hidden pt-4 pb-3 text-3xl font-bold text-center xl:text-5xl md:text-4xl">
        <Link
          className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl c-beige:text-beige-800"
          href="/share"
        >
          Share
        </Link>
      </h1>
      <p className="text-sm text-center small-caps lg:text-base c-beige:text-beige-800">
        URL Shortener + QR Code Generator
      </p>
    </div>
  )
}