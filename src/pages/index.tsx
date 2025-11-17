import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique vers la page Jeannette
    router.replace('/jeannette')
  }, [])

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

        <p className="text-gray-500 italic">
          Redirection en cours...
        </p>

        <p className="text-gray-600 text-sm">
          Les créations de Frédéric et Camille seront mises en ligne ultérieurement.
        </p>
      </div>
    </div>
    </>
  )
}