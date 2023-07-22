import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import Providers from '../Providers'
import store from '../store/store'

function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps, Component } = props

  return (
    <Providers store={store}>
      <Layout title="Lending & Borrowing">
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}

export default MyApp
