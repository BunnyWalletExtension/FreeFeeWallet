import './styles/TokensPage.css';
// import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';
import * as func from '../functions/index'
import * as img_lib from '../img/index'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeShowTxs } from '../redux/slices/txsSlice';
import { incrementByAmount } from '../redux/slices/balanceSlice';

function TokensPage() {
    const [sendToken, setSendToken] = useState(false);
    const [pubKey, setPubKey] = useState('');
    const [amountToken, setAmountToken] = useState(0);

    const password = useSelector((state: any) => state.password.value);
    const wallets = useSelector((state: any) => state.wallets.value);
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const showTxs = useSelector(((state: any) => state.txs.show));
    const balance = useSelector((state: any) => state.balance.value);

    const dispatch = useDispatch();

    // const getWalletCosmos = async (mnemonic: string) => {
    //     const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    //         prefix: 'orai',
    //     });
    //     const [firstAccount] = await wallet.getAccounts();
    //     return firstAccount;
    // }

    const getKeypairFromMnemonic = (mnemonic: string, derivationPath: string = "m/44'/501'/0'/0'"): Keypair => {
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const derivedSeed = derivePath(derivationPath, seed).key;
        return Keypair.fromSeed(derivedSeed.slice(0, 32));
    }

    useEffect(() => {
        const currentWallet = wallets[indexWallet];
        console.log("Current wallet:", currentWallet);
        func.decryptSeed(
            currentWallet.mnemonic.encrypted,
            currentWallet.mnemonic.salt,
            currentWallet.mnemonic.iv,
            password
        ).then(async (seedPhrase) => {
            console.log('Seed Phrase:', seedPhrase);
            const keyPair = getKeypairFromMnemonic(seedPhrase);
            console.log('Keypair:', keyPair);
            setPubKey(keyPair.publicKey.toBase58());
        })
    }, [password, wallets, indexWallet]);

    useEffect(() => {
        if (showTxs) {
            const el = document.querySelector('.transaction') as HTMLInputElement;
            if (!el) return;
            const notifyTxs = document.querySelector('.notify-txs') as HTMLInputElement;

            const rejectButton = el.querySelector('.reject-button') as HTMLInputElement;
            rejectButton.addEventListener('click', () => {
                dispatch(changeShowTxs(false));
                notifyTxs.textContent = 'Transaction rejected';
                notifyTxs.style.color = 'red';
                notifyTxs.style.border = '1px solid red';
                notifyTxs.style.opacity = '1';
                setTimeout(() => {
                    notifyTxs.style.opacity = '0';
                }, 3000);
            });

            const approveButton = el.querySelector('.approve-button') as HTMLInputElement;
            approveButton.addEventListener('click', () => {
                console.log('Send token index, amount: ', indexWallet, amountToken);
                dispatch(incrementByAmount({
                    index: indexWallet,
                    amount: - amountToken
                }));
                approveButton.textContent = 'Approving...';
                setTimeout(() => {
                    approveButton.textContent = 'Approve';
                    dispatch(changeShowTxs(false));
                    notifyTxs.textContent = 'Transaction successful';
                    notifyTxs.style.color = '#58fe80';
                    notifyTxs.style.border = '1px solid #58fe80';
                    notifyTxs.style.opacity = '1';
                    setTimeout(() => {
                        notifyTxs.style.opacity = '0';
                    }, 3000);
                }, 2000);
            });
        }
    }, [showTxs]);

    const clickSendToken = () => {
        const inputAmount = document.querySelector('.input-amount-fill') as HTMLInputElement;
        if (inputAmount) {
            setAmountToken(parseFloat(inputAmount.value));
        }
        setSendToken(false);
        dispatch(changeShowTxs(true));
    }

    const copyToClipboard = (str: string) => {
        navigator.clipboard.writeText(str).then(() => {
            console.log('Mnemonic copied to clipboard:', str);
        }).catch(err => {
            console.error('Failed to copy mnemonic: ', err);
        });
    }

    const copyAddress = () => {
        copyToClipboard(pubKey);
        const copiedIcon = document.querySelector('.copy-address') as HTMLInputElement;
        copiedIcon.src = img_lib.copied;
        setTimeout(() => {
            copiedIcon.src = img_lib.copy;
        }, 2000);
    }

    return (
        <div className='tokens-page'>
            <div className='profile-user'>
                <div className='profile-row'>
                    <img className='profile-user-img' src={img_lib.user} />
                    <div className='profile-user-name'>{wallets[indexWallet].name}</div>
                    <div className='end-row'>
                        <img className='copy-address' src={img_lib.copy} onClick={copyAddress} />
                        <div className='profile-user-address'>{pubKey.slice(0, 7) + '...' + pubKey.slice(40, 44)}</div>
                    </div>
                </div>
                <div className='profile-row'>
                    <div className='usdt-balance'>{'$ ' + (Number(balance[indexWallet]) * 164).toFixed(2)}</div>
                </div>
                <div className='profile-row'>
                    <div className='receive-button'>Receive</div>
                    <div className='send-button' onClick={() => { setSendToken(true) }}>Send</div>
                </div>
            </div>
            <div className='tokens' style={{ marginTop: '10px' }}>
                <div className='token-item'>
                    <img className='token-img' src={img_lib.logo_solana} />
                    <div className='token-symbol'>SOL</div>
                    <div className='flex-end2'>
                        <div className='token-balance'>{balance[indexWallet].toFixed(5)}</div>
                        <div className='token-value'>{'$ ' + (Number(balance[indexWallet]) * 164).toFixed(2)}</div>
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
                    <div className='tokens' style={{ position: 'fixed', top: '350px' }}>
                        <div className='token-item'>
                            <input type='checkbox' className='checkbox-token'
                                style={{ marginRight: '10px', cursor: 'pointer' }}
                            />
                            <img className='token-img' src={img_lib.logo_solana} />
                            <div className='token-symbol'>SOL</div>
                            <div className='flex-end2'>
                                <div className='token-balance'>{balance[indexWallet].toFixed(5)}</div>
                                <div className='token-value'>{'$ ' + (Number(balance[indexWallet]) * 164).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default TokensPage;