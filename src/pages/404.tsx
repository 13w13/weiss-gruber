import Head from 'next/head'
import Link from 'next/link'
import { useT } from '@/i18n'

export default function Custom404() {
  const t = useT()
  return (
    <>
      <Head>
        <title>{`404 - ${t.errors.notFoundTitle} | Weiss Gruber`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light">{t.errors.notFoundTitle}</h1>
          <p className="text-gray-600">{t.errors.notFoundText}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/jeannette/catalogue" className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{t.errors.toWorks}</Link>
            <Link href="/jeannette" className="px-5 py-3 border border-gray-300 rounded hover:bg-gray-50 transition">{t.errors.home}</Link>
          </div>
        </div>
      </div>
    </>
  )
}
