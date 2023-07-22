import { Store } from '@reduxjs/toolkit'
import { createConfig, WagmiConfig } from 'wagmi'
import { avalanche } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { ToastsProvider } from './context/ToastsContext'
import { Provider } from 'react-redux'

const config = createConfig(
  getDefaultConfig({
    appName: 'Lending',
    // infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    // alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [avalanche],
    walletConnectProjectId: 'e542ff314e26ff34de2d4fba98db70bb',
  })
)

const Providers: React.FC<
  React.PropsWithChildren<{ store: Store; children: React.ReactNode }>
> = ({ children, store }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        customTheme={{
          '--ck-connectbutton-border-radius': '0.5rem',
          '--ck-connectbutton-background': '#203349',
          '--ck-connectbutton-hover-background': '#203349',
          '--ck-connectbutton-active-background': '#203349',
          '--ck-connectbutton-border-size': '1px',
          '--ck-body-background': '#1f304a',
          '--ck-primary-button-background': '#2a3b53',
          '--ck-primary-button-hover-background': 'rgb(24,37,57)',
          '--ck-secondary-button-background': '#2a3b53',
          '--ck-secondary-button-hover-background': 'rgb(24,37,57)',
          '--ck-connectbutton-color':'white',
          '--ck-body-color':'white',
          '--ck-body-background-tertiary':'#293d5b',
          '--ck-primary-button-color':'white',
          '--ck-primary-button-hover-color':'white',
          '--ck-connectbutton-hover-color':'white'
        }}
      >
        <Provider store={store}>
          <ToastsProvider>{children}</ToastsProvider>
        </Provider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default Providers
