import './styles/Accounts.css'
import { useSelector } from 'react-redux';
import * as img_lib from '../img/index'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeIndexWallet } from '../redux/slices/walletsSlice';
import { changePage } from '../redux/slices/pageSlice';

const listPages = ['token-page', 'earn-page', 'swap-page', 'activity-page'];

function Accounts() {
    const [showAccs, setShowAccs] = useState(false);
    const pageCurrent = useSelector((state: any) => state.page.value);
    const wallets = useSelector((state: any) => state.wallets.value);
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const dispatch = useDispatch();

    return (
        <>
            {listPages.includes(pageCurrent) &&
                <div className='wrap-user-logo' onClick={() => setShowAccs(true)}>
                    <img className='user-logo' src={img_lib.user} />
                </div>
            }

            {showAccs &&
                <div className='wrap-accounts-list'>
                    <img className='back-button' src={img_lib.back_button} onClick={() => { setShowAccs(false) }} />
                    <div className='accounts-list'>
                        {wallets.map((item: any, index: number) => (
                            <div className='account-item'
                                onClick={() => {
                                    if (indexWallet !== index) {
                                        chrome.storage.local.set({ indexWallet: index }, () => {
                                            dispatch(changeIndexWallet(index));
                                        });
                                    }
                                }}
                            >
                                <div className='account-item-col-1'>
                                    <div className='wallet-index'>{'Wallet ' + (index + 1).toString()}</div>
                                    <div className='account-name'>{'= ' + item.name}</div>
                                </div>
                                {indexWallet === index &&
                                    <div className='selected-icon'>Selected</div>
                                }
                            </div>
                        ))}
                    </div>
                    <div className='add-wallet-button' onClick={() => { setShowAccs(false); dispatch(changePage('add-wallet-page')); }}>Add Wallet</div>
                </div>
            }
        </>
    );
}

export default Accounts;