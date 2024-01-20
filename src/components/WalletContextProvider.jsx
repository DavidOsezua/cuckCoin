import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from '@solana/web3.js'
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = web3.clusterApiUrl(network)
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter(), 
        new walletAdapterWallets.SafePalWalletAdapter(),
        new walletAdapterWallets.TrustWalletAdapter()
    ]
	return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    { children }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider