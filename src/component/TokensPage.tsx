import './styles/TokensPage.css';
// import { /*Connection, LAMPORTS_PER_SOL, PublicKey,*/ Keypair } from '@solana/web3.js';
// import { derivePath } from 'ed25519-hd-key';
import * as func from '../functions/index'
import * as img_lib from '../img/index'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Transaction from './Transaction';
import { useDispatch } from 'react-redux';
import { changeShowTxs } from '../redux/slices/txsSlice';

function TokensPage() {
    const pubK = "7q6PYSw2dCYfw74igJtDB4iodhCrGBvUg78TnScK6kZj";

    const [sendToken, setSendToken] = useState(false);

    const password = useSelector((state: any) => state.password.value);
    const wallets = useSelector((state: any) => state.wallets.value);
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const showTxs = useSelector(((state: any) => state.txs.show));

    const dispatch = useDispatch();

    useEffect(() => {
        const wallet = wallets[indexWallet];
        console.log(wallet);
        func.decryptSeed(
            wallet.mnemonic.encrypted,
            wallet.mnemonic.salt,
            wallet.mnemonic.iv,
            password
        ).then((seedPhrase) => {
            console.log('Seed Phrase:', seedPhrase);
            // const derivedSeed = derivePath("m/44'/501'/0'/0'", seedPhrase).key;
            // const keypair = Keypair.fromSeed(derivedSeed);
            // setPubKey(keypair.publicKey.toString());
        })
    }, [password, wallets, indexWallet]);

    useEffect(() => {
        if (showTxs) { }
    }, [showTxs]);

    const clickSendToken = () => {
        setSendToken(false);
        dispatch(changeShowTxs(true));
    }

    return (
        <div className='tokens-page'>
            <Transaction />
            <div className='profile-user'>
                <div className='profile-user-row-1'>
                    <img className='profile-user-img' src={img_lib.user} />
                    <div className='profile-user-name'>{wallets[indexWallet].name}</div>
                    <div className='flex-end'>
                        <img className='copy-address' src={img_lib.copy} />
                        <div className='profile-user-address'>{pubK.slice(0, 5) + '...' + pubK.slice(40, 44)}</div>
                    </div>
                </div>
                <div className='usdt-balance'>$ 2.35</div>
                <div className='receive-button'>Receive</div>
                <div className='send-button' onClick={() => { setSendToken(true) }}>Send</div>
            </div>
            <div className='tokens'>
                <div className='token-item'>
                    <img className='token-img' src={img_lib.logo_solana} />
                    <div className='token-symbol'>SOL</div>
                    <div className='flex-end2'>
                        <div className='token-balance'>0.0000</div>
                        <div className='token-value'>$ 0.00</div>
                    </div>
                </div>
            </div>

            {sendToken &&
                <div className='send-token-modal'>
                    <img className='close-send-token'
                        src={img_lib.back_button}
                        onClick={() => { setSendToken(false) }}
                    />
                    <div className='send-token-title'>SEND TOKEN</div>
                    <div className='input-to'>
                        TO_ADDRESS
                        <input className='input-to-fill' type='text' placeholder='Enter address' />
                    </div>
                    <div className='input-amount'>
                        AMOUNT
                        <input className='input-amount-fill' type='text' placeholder='Enter amount' />
                    </div>
                    <div className='send-token-button'
                        onClick={clickSendToken}
                    >
                        Send
                    </div>
                    <div className='token-item' style={{ top: '350px' }}>
                        <input type='checkbox' className='checkbox-token'
                            style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                        <img className='token-img' src={img_lib.logo_solana} />
                        <div className='token-symbol'>SOL</div>
                        <div className='flex-end2'>
                            <div className='token-balance'>0.0000</div>
                            <div className='token-value'>$ 0.00</div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default TokensPage;