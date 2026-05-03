import { http, createConfig } from 'wagmi'
import {mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ``

export const CONTRACTS = {
  chain4201: {
    // LUKSO testnet
    forwarder: '0x3d3AE14163C0fe23317b322908e6CC0D4289e0A7',
    chat: '0xCA6a25e14873871b116011803F5E2FD2B9442E59',
  },
  chain42: {
    // LUKSO
    forwarder: '0xaa609a768A0A9c67A1d9B6F33Cb965C69bC0026E',
    chat: '0x5D339E1D5Bb6Eb960600c907Ae6E7276D8196240',
  },
  chain143: {
    // Monad
    forwarder: '0xc407722d150c8a65e890096869f8015D90a89EfD',
    chat: '0xA5e73b15c1C3eE477AED682741f0324C6787bbb8',
  },
}

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
})

/**
 * Set network colors
 * @param {json} chain
 */
export const setNetworkColor = (chain) => {
  const rootElement = document.documentElement
  rootElement.style.setProperty(`--network-color-primary`, chain.primaryColor)
  rootElement.style.setProperty(`--network-color-text`, chain.textColor)
}

/**
 * Get network colors
 * @param {json} chain
 */
export const getNetworkColor = () => {
  const rootElement = document.documentElement
  const primaryColor = rootElement.style.getPropertyValue(`--network-color-primary`)
  const secondaryColor = rootElement.style.getPropertyValue(`--network-color-text`)
  return { primaryColor, secondaryColor }
}

console.log(config)
