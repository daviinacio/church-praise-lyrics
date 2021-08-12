import Head from 'next/head'

export default function SEO({ title, description, children }){
  const siteName = "Ministério de louvor (AD Fogo e glória)"

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{ (title ? title + ' · ' : '') + siteName }</title>
      <meta name="description" content={ description } />
      {/* <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" /> */}
      {/* <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" /> */}

      {/* <meta name="twitter:image:src" content={ image || defaultImage} /> */}
      {/* <meta name="twitter:site" content={`@${defaultSite}`} /> */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={ title + ' · ' + siteName } />
      <meta name="twitter:description" content={ description } />

      {/* <meta property="og:image" content={ image || defaultImage} /> */}
      <meta property="og:site_name" content={ siteName } />
      <meta property="og:type" content="object" />
      <meta property="og:title" content={ title + ' · ' + siteName } />
      <meta property="og:url" content={ "https://adfg-louvor.vercel.app/" } />
      <meta property="og:description" content={ description } />

      {/* <link rel="dns-prefetch" href="//fonts.gstatic.com" /> */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" /> */}

      {/* <meta name="theme-color" content="#ab5803" /> */}

      {children}
    </Head>
  )
}