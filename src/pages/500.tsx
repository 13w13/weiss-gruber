import Head from 'next/head'
import Link from 'next/link'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Erreur serveur | Weiss Gruber</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light">Une erreur est survenue</h1>
          <p className="text-gray-600">Veuillez réessayer dans quelques instants.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/jeannette" className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Accéder aux œuvres</Link>
            <Link href="/" className="px-5 py-3 border border-gray-300 rounded hover:bg-gray-50 transition">Accueil</Link>
          </div>
        </div>
      </div>
    </>
  )
}
