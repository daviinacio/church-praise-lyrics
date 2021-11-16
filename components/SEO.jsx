import Head from 'next/head'

export default function SEO({ title, description, children }){
  const siteName = "Ministério de louvor (AD Fogo e glória)"

  return (
    <Head>
      <meta name='application-name' content='ADFG Louvor' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='ADFG Louvor' />

      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='msapplication-config' content='/icons/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='#ab5803' />
      <meta name='msapplication-tap-highlight' content='no' />
      
      <meta name='theme-color' content='#ab5803' />

      <link rel='manifest' href='/manifest.json' />
      
      <meta charSet="utf-8" />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />

      {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

      <title>{ (typeof title !== 'undefined' ? title + ' · ' : '') + siteName }</title>
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