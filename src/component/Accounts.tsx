import './styles/Accounts.css'
import { useSelector } from 'react-redux';
import * as img_lib from '../img/index'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeIndexWallet, changeWallets } from '../redux/slices/walletsSlice';
import { changePage } from '../redux/slices/pageSlice';

const listPages = ['token-page', 'earn-page', 'activity-page'];

function Accounts() {
    const [showAccs, setShowAccs] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const pageCurrent = useSelector((state: any) => state.page.value);
    const wallets = useSelector((state: any) => state.wallets.value);
    const indexWallet = useSelector((state: any) => state.wallets.indexWallet);
    const dispatch = useDispatch();

    const removeWallet = (index: number) => () => {
        if (indexWallet >= index) {
            let newIndex = indexWallet - 1;
            if (newIndex < 0 && wallets.length > 1) {
                newIndex = 0;
            }
            dispatch(changeIndexWallet(newIndex));
            chrome.storage.local.set({ indexWallet: newIndex }, () => { });
        }
        const newWallets = wallets.filter((_: any, i: any) => i !== index);
        dispatch(changeWallets(newWallets));
        chrome.storage.local.set({ wallets: newWallets }, () => { });
    }

    return (
        <>
            {listPages.includes(pageCurrent) &&
                <div className='wrap-user-logo' onClick={() => setShowAccs(true)}>
                    <img className='user-logo' src={img_lib.user} />
                </div>
            }

            {showAccs &&
                <div className='wrap-accounts'>
                    <img className='back-button' src={img_lib.back_button} onClick={() => { setShowAccs(false) }} />
                    <div className='accounts-list'>
                        {wallets.map((item: any, index: number) => (
                            <div className='account-item'>
                                <div className='account-item-col-1'>
                                    <div className='wallet-index'>{'Wallet ' + (index + 1).toString()}</div>
                                    <div className='account-name'>{'= ' + item.name}</div>
                                </div>
                                <div className='wrap-end'>
                                    {indexWallet === index &&
                                        <div className='selected-icon'>Selected</div>
                                    }
                                    <div className='wrap-edit-options' onClick={() => setEditIndex(index === editIndex ? -1 : index)}>
                                        {editIndex === index &&
                                            <div className='edit-options'>
                                                <div className='edit-option'
                                                    onClick={() => {
                                                        if (indexWallet !== index) {
                                                            dispatch(changeIndexWallet(index));
                                                            chrome.storage.local.set({ indexWallet: index }, () => { });
                                                        }
                                                    }}
                                                >
                                                    Choose wallet
                                                </div>
                                                <div className='edit-option'>
                                                    View Secret Phase
                                                </div>
                                                <div className='edit-option'>
                                                    Change Wallet Name
                                                </div>
                                                <div className='edit-option'
                                                    onClick={removeWallet(index)}
                                                >
                                                    Remove wallet
                                                </div>
                                            </div>
                                        }
                                        <img className='edit-icon' src={img_lib.dot3} />
                                    </div>
                                </div>
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