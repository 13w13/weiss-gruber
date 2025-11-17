import Link from 'next/link'
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Jeannette Weiss Gruber - Peintre-verrier</title>
        <meta name="description" content="Explorer les réalisations de la peintre-verrier Jeannette Weiss Gruber" />
        <meta property="og:title" content="Jeannette Weiss Gruber - Peintre-verrier" />
        <meta property="og:description" content="Explorer les réalisations de la peintre-verrier Jeannette Weiss Gruber" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-lg md:text-xl">
          Site dédié aux créations de <strong>Jeannette Weiss Gruber</strong>,
          <strong> Frédéric Weiss</strong> et <strong>Camille Weiss</strong>.
        </p>

        <p className="text-lg md:text-xl">
          Les œuvres de Jeannette Weiss Gruber sont visibles ici :
        </p>

        <Link
          href="/jeannette"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Découvrir Jeannette
        </Link>

        <p className="text-gray-600 text-sm">
          Les créations de Frédéric et Camille seront mises en ligne ultérieurement.
        </p>
      </div>
    </div>
    </>
  )
}