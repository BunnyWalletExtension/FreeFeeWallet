import './styles/LoginPage.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changePassword } from '../redux/slices/passwordSlice';
import * as func from '../functions/index';
import * as img_lib from '../img/index';

function LoginPage() {
    const dispatch = useDispatch();
    const [signedUp, setSignedUp] = useState(false);

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['hashPassword'], (result) => {
                setSignedUp(!!result.hashPassword);
            });
        }
    }, []);

    const onChangeConfirm = () => {
        const passwordNew = document.querySelector('.password-new') as HTMLInputElement;
        const passwordConfirm = document.querySelector('.password-confirm') as HTMLInputElement;
        const element = document.querySelector('.password-not-match') as HTMLDivElement;
        if (passwordNew.value !== passwordConfirm.value) {
            element.style.opacity = '1';
        } else {
            element.style.opacity = '0';
        }
    };

    const createNewAccount = async () => {
        const passwordNew = document.querySelector('.password-new') as HTMLInputElement;
        const passwordConfirm = document.querySelector('.password-confirm') as HTMLInputElement;
        if (passwordNew.value !== passwordConfirm.value) return;
        const { hash: hashPass, salt: saltPass } = await func.hashPassword(passwordNew.value);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            console.log(hashPass, saltPass);
            chrome.storage.local.set({ hashPassword: hashPass }, () => {
                console.log('Hash password saved:', hashPass);
            });
            chrome.storage.local.set({ saltPassword: saltPass }, () => {
                console.log('Salt password saved:', saltPass);
            });
        }
        setSignedUp(true);
    }

    const logIn = async () => {
        const passwordInput = document.querySelector('.password-input') as HTMLInputElement;
        console.log(passwordInput.value);
        if (!passwordInput.value) return;
        if (typeof chrome !== 'undefined' && chrome.storage) {
            let hashPass: string = '', saltPass: number[] = [];
            chrome.storage.local.get(['hashPassword'], (result1) => {
                hashPass = result1.hashPassword || '';
                chrome.storage.local.get(['saltPassword'], async (result2) => {
                    saltPass = result2.saltPassword || [];
                    if (hashPass === '' || saltPass.length === 0) {
                        chrome.storage.local.remove(['saltPassword', 'hashPassword'], () => { });
                        return;
                    }
                    if (hashPass && (await func.verifyPassword(passwordInput.value, hashPass, saltPass))) {
                        chrome.storage.local.set({ password: passwordInput.value }, () => {
                            chrome.storage.local.set({ timeLogIn: new Date(Date.now()).toISOString() }, () => {
                                dispatch(changePassword(passwordInput.value));
                            });
                        });
                    }
                });
            });
        }
    }

    return (
        <div className='login-page'>
            <img className='books' alt="books" src={img_lib.books} />
            <img className='logo-cat' alt="logo-cat" src={img_lib.cat} />
            <div className='name-wallet'>FreeFee Wallet</div>
            <div className='slogan'>Securely store and transact with ease.</div>
            {signedUp ? (
                <div>
                    <input className="password-input" type="password" placeholder="Enter your account password" />
                    <button className='unlock-button' onClick={logIn}>Unlock</button>
                </div>
            ) : (
                <div>
                    <input className="password-new" type="password" placeholder="Enter new account password" />
                    <input className="password-confirm" type="password" placeholder="Confirm password" onChange={onChangeConfirm} />
                    <div className='password-not-match'>Passwords do not match</div>
                    <button className='create-account-button' onClick={createNewAccount}>Create Account</button>
                </div>
            )}
        </div>
    );
}

export default LoginPage    