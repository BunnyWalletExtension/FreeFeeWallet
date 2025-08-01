import './styles/AddWalletPage.css'
import { useEffect, useState } from 'react';
import * as bip39 from 'bip39';
import * as img_lib from '../img/index'
import * as func from '../functions/index';
import { useDispatch } from 'react-redux';
import { changePage } from '../redux/slices/pageSlice';
import { useSelector } from 'react-redux';
import { changeIndexWallet, changeWallets } from '../redux/slices/walletsSlice';

const array = {
    3: Array.from({ length: 3 }, (_, i) => i + 1),
    6: Array.from({ length: 6 }, (_, i) => i + 1),
    4: Array.from({ length: 4 }, (_, i) => i + 1),
};

function AddWalletPage() {
    const [step, setStep] = useState(0);
    const [mnemonicLength, setMnemonicLength] = useState(12);
    const [mnemonic, setMnemonic] = useState('');
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const password = useSelector((state: any) => state.password.value);
    const dispatch = useDispatch();

    useEffect(() => {
    }, []);

    useEffect(() => {
    }, [step]);

    const clickBack = () => {
        if (step === 0) {
            dispatch(changePage('token-page'));
        } else {
            setStep(step - 1);
        }
    }

    const changeMnemonicLength = (length: number) => {
        setMnemonicLength(length);
        const mnemonicChars = document.querySelectorAll('.mnemonic-char');
        mnemonicChars.forEach((el) => {
            (el as HTMLInputElement).value = '';
        });
    }

    const pasteWords = (paste: string, index: number) => {
        const words = paste.split(' ');
        words.map((word, i) => {
            const el = document.querySelector(`.mnemonic-char.tt-${index + i}`) as HTMLInputElement;
            if (el) {
                el.value = word;
            }
        });
    }

    const onPasteMnemonic = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        pasteWords(paste, index);
    }

    const copyToClipboard = (str: string) => {
        navigator.clipboard.writeText(str).then(() => {
            console.log('Mnemonic copied to clipboard:', str);
        }).catch(err => {
            console.error('Failed to copy mnemonic: ', err);
        });
    }

    const notify = (message: string, color: string) => {
        const el = document.querySelector('.notification') as HTMLDivElement;
        if (el) {
            el.textContent = message;
            el.style.color = color;
            el.style.opacity = '1';
            setTimeout(() => {
                el.style.opacity = '0';
            }, 3000);
        }
    }

    const generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic(mnemonicLength === 12 ? 128 : 256);
        pasteWords(mnemonic, 1);
        copyToClipboard(mnemonic);
        notify('Copied mnemonic to clipboard', '#87F422');
    }

    const onClickNext = () => {
        let mnemonicWords = '';
        const mnemonicChars = document.querySelectorAll('.mnemonic-char');
        mnemonicChars.forEach((el) => {
            mnemonicWords += (el as HTMLInputElement).value + ' ';
        });
        if (bip39.validateMnemonic(mnemonicWords.trim())) {
            setMnemonic(mnemonicWords.trim());
            console.log('Valid mnemonic:', mnemonicWords.trim());
            setStep(step + 1);
        } else {
            notify('Invalid mnemonic', 'red');
        }
    }

    const createNewWallet = () => {
        const nameInput = document.querySelector('.name-wallet-input') as HTMLInputElement;
        const walletName = nameInput.value.trim();
        if (walletName === '') {
            console.log('Please enter a wallet name');
            notify('Please enter a wallet name', 'red');
            return;
        }

        func.encryptSeed(mnemonic, password).then((encryptedData) => {
            const newWallet = {
                name: walletName,
                mnemonic: encryptedData,
            };
            chrome.storage.local.get(['wallets'], (result) => {
                let wallets = result.wallets || [];
                wallets.push(newWallet);
                const newIndex = indexWallet + (indexWallet === -1);
                chrome.storage.local.set({ wallets: wallets }, () => {
                    chrome.storage.local.set({ indexWallet: newIndex }, () => {
                        dispatch(changeIndexWallet(newIndex));
                        dispatch(changeWallets(wallets));
                        dispatch(changePage('token-page'));
                    });
                });
            });
        }).catch((error) => {
            console.error('Error creating wallet:', error);
            notify('Error creating wallet', 'red');
        });
    }

    return (
        <div className='add-wallet-page'>
            {/* {step === '0' &&
                <div className={`add-wallet-${step}`}>
                    <div className='wrap-create-wallet-button'>
                        <button className='create-wallet-button'
                            onClick={() => { setStep('create-wallet'); }}
                        >
                            Create a new wallet
                        </button>
                    </div>
                    <div className='wrap-import-mnemonic-button'>
                        <button className='import-mnemonic-button'
                            onClick={() => { setStep('import-mnemonic') }}
                        >
                            Import From Mnemonic
                        </button>
                    </div>
                </div>
            }
            {step === 'create-wallet' &&
                <div className='create-wallet'>
                </div>
            } */}
            {(indexWallet !== -1 || step > 0) && <img className='back-button' src={img_lib.back_button} onClick={clickBack} />}
            {step === 0 &&
                <div className='import-mnemonic'>
                    <div className='import-mnemonic-title'>Import your mnemonic or generate new</div>
                    <div className='change-length'>
                        <div className='length-12' onClick={() => changeMnemonicLength(12)}
                            style={{
                                backgroundColor: mnemonicLength === 12 ? '#2f2f2f' : '#010101',
                                color: mnemonicLength === 12 ? '#87F422' : '#8D8B84'
                            }}
                        >
                            12 words
                        </div>
                        <div className='length-24' onClick={() => changeMnemonicLength(24)}
                            style={{
                                backgroundColor: mnemonicLength === 24 ? '#2f2f2f' : '#010101',
                                color: mnemonicLength === 24 ? '#87F422' : '#8D8B84'
                            }}
                        >
                            24 words
                        </div>
                    </div>
                    {(array as any)[mnemonicLength / 4].map((item1: any) => {
                        return (
                            array[4].map((item2) => {
                                return (
                                    <>
                                        <div className={`mnemonic-char-index tt-${(item1 - 1) * 4 + item2}`}
                                            style={{
                                                position: 'fixed',
                                                top: `${(item1 - 1) * 50 + 109}px`,
                                                right: `${65 + (4 - item2) * 85}px`,
                                                zIndex: 1000,
                                            }}
                                        >
                                            {`${(item1 - 1) * 4 + item2}.`}
                                        </div>

                                        <input className={`mnemonic-char tt-${(item1 - 1) * 4 + item2}`}
                                            type='password'
                                            style={{
                                                position: 'fixed',
                                                top: `${(item1 - 1) * 50 + 100}px`,
                                                left: `${(item2 - 1) * 85 + 30}px`
                                            }}
                                            onFocus={() => {
                                                const el = document.querySelector(`.mnemonic-char.tt-${(item1 - 1) * 4 + item2}`);
                                                if (el) {
                                                    (el as any)['type'] = 'text';
                                                }
                                            }}
                                            onBlur={() => {
                                                const el = document.querySelector(`.mnemonic-char.tt-${(item1 - 1) * 4 + item2}`);
                                                if (el) {
                                                    (el as any)['type'] = 'password';
                                                }
                                            }}
                                            onPaste={(e) => onPasteMnemonic(e, (item1 - 1) * 4 + item2)}
                                        />
                                    </>
                                )
                            })
                        )
                    })}
                    <div className='notification'
                        style={{
                            top: step === 0 ? (mnemonicLength === 12 ? '300px' : '400px') : '260px',
                            opacity: 0,
                        }}
                    >
                    </div>
                    <div className='next-button'
                        style={{
                            position: 'fixed',
                            top: mnemonicLength === 12 ? '330px' : '430px',
                            left: '25px',
                        }}
                        onClick={onClickNext}
                    >
                        Next
                    </div>
                    <div className='gen-mnemonic-button'
                        style={{
                            position: 'fixed',
                            top: mnemonicLength === 12 ? '390px' : '490px',
                            left: '25px',
                        }}
                        onClick={generateMnemonic}
                    >
                        Generate Mnemonic
                    </div>
                </div>
            }
            {step === 1 &&
                <div className='create-name-wallet'>
                    <div className='create-name-wallet-title'>Wallet Name</div>
                    <input className='name-wallet-input' type='text' placeholder="Your wallet's name" />
                    <div className='create-name-wallet-button' onClick={createNewWallet}>
                        Create Wallet
                    </div>
                </div>
            }
        </div>
    )
}

export default AddWalletPage;