import './App.css'
import LoginPage from './component/LoginPage'
import TokensPage from './component/TokensPage'
import EarnPage from './component/EarnPage'
import Chains from './component/Chains'
import SwitchPage from './component/SwitchPage'
import AddWalletPage from './component/AddWalletPage'
import Accounts from './component/Accounts'
import SwapPage from './component/SwapPage'
import ActivityPage from './component/ActivityPage'
import { useSelector } from 'react-redux';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { changePassword } from './redux/slices/passwordSlice'
import { changePage } from './redux/slices/pageSlice'
import { changeIndexWallet, changeWallets } from './redux/slices/walletsSlice'

function App() {
    const pageCurrent = useSelector((state: any) => state.page.value);
    const password = useSelector((state: any) => state.password.value);
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const dispatch = useDispatch();

    useEffect(() => {
        chrome.storage.local.get(['timeLogIn', 'password', 'wallets', 'indexWallet'], (result) => {
            if (result.password) {
                dispatch(changePassword(result.password));
            }
            if (result.wallets) {
                dispatch(changeWallets(result.wallets));
            }
            if (result.indexWallet !== undefined) {
                dispatch(changeIndexWallet(result.indexWallet));
            } else {
                if (result.wallets && result.wallets.length > 0) {
                    dispatch(changeIndexWallet(0));
                }
            }
            if (result.timeLogIn) {
                const diff = Number(new Date(Date.now())) - Number(new Date(result.timeLogIn));
                if (diff > 1000 * 60 * 60 * 24) {
                    chrome.storage.local.remove(['password', 'timeLogIn'], () => { });
                    dispatch(changePassword(''));
                    dispatch(changePage('login-page'));
                }
            }
        });
    }, []);

    useEffect(() => {
        if (pageCurrent !== 'login-page' && pageCurrent !== 'add-wallet-page' && indexWallet === -1) {
            dispatch(changePage('add-wallet-page'));
        }
    }, [pageCurrent, indexWallet]);

    useEffect(() => {
        if (password !== '') {
            if (indexWallet !== -1) {
                dispatch(changePage('token-page'));
            } else {
                dispatch(changePage('add-wallet-page'));
            }
        }
    }, [password, indexWallet])

    return (
        <div className='App'>
            <Chains />
            <Accounts />
            {pageCurrent === 'login-page' && <LoginPage />}
            {pageCurrent === 'add-wallet-page' && <AddWalletPage />}
            {pageCurrent === 'token-page' && <TokensPage />}
            {pageCurrent === 'earn-page' && <EarnPage />}
            {pageCurrent === 'swap-page' && <SwapPage />}
            {pageCurrent === 'activity-page' && <ActivityPage />}
            <SwitchPage />
            {/* <Transaction /> */}
        </div>
    )
}

export default App
