import Link from "next/link";
import Head from "next/head";

export const Custom404 = () => {
  return (
    <>
      <Head>
        <title>ACES RMDSSOE | Who dis?</title>
        <meta
          name="description"
          content="Whoops, looks like you took a wrong turn. Let's get you back home."
        />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-950 dark:bg-gray-950 text-gray-50 p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          {/* <img
            src="https://raw.githubusercontent.com/ACES-RMDSSOE/Website/main/images/logo.png"
            width={320}
            height={240}
            alt="ACES Logo"
            className="mx-auto aspect-video rounded-lg object-cover"
          /> */}
          <div class="avatar-container">
            <a href="https://aces-rmdssoe.tech">
              <img
                src="https://raw.githubusercontent.com/MadhurJ20/Invoice/master/assets/ACES_Logo.png"
                alt="ACES Logo"
                class="avatar"
              />
            </a>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Oops! Page Not Found</h1>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Link
            href="https://aces-rmdssoe.tech"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-50 px-6 text-sm font-medium text-gray-950 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            Go back home
          </Link>
        </div>
      </div>
    </>
  );
};
