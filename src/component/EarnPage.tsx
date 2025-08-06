import * as img_lib from '../img/index';
import './styles/EarnPage.css';
import add_button from '../img/add_button.png'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeShowTxs } from '../redux/slices/txsSlice';

const earnTokens = [
    {
        token: 'Solana',
        chain: 'Base',
        earnPercent: 5.46,
        tokenAmount: 0.11236,
        tokenUSDT: 18.42,
    },
    // {
    //     token: 'Solana',
    //     chain: 'Base',
    //     earnPercent: 5.46,
    //     tokenAmount: 0.00000,
    //     tokenUSDT: 0.00,
    // }
];

const tokenProtocols = [
    [
        {
            name: 'Kamino',
            tvl: '12M',
            apr: '4.5%',
        },
        {
            name: 'Solend',
            tvl: '18M',
            apr: '3.6%',
        }
    ],
    [
        {
            name: 'Kamino',
            tvl: '12M',
            apr: '4.5%',
        }
    ]
];

const img: any = {
    'solana': img_lib.logo_solana,
    'base': img_lib.logo_base,
    'kamino': img_lib.logo_kamino,
    'solend': img_lib.logo_solend,
};

function EarnPage() {
    const [extendStates, setExtendStates] = useState(Array(earnTokens.length).fill(false));
    const [activeIndex, setActiveIndex] = useState(Array(earnTokens.length).fill(-1));
    const [showEarning, setShowEarning] = useState(false);
    const showTxs = useSelector(((state: any) => state.txs.show));
    const dispatch = useDispatch();

    const toggleExtend = (index: number) => {
        setExtendStates(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const chooseIndex = (tokenIndex: number, protocolIndex: number) => {
        setActiveIndex(prevState => {
            const newState = [...prevState];
            newState[tokenIndex] = prevState[tokenIndex] === protocolIndex ? -1 : protocolIndex;
            return newState;
        });
    };

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
                approveButton.textContent = 'Approving...';
                setTimeout(() => {
                    approveButton.textContent = 'Approve';
                    dispatch(changeShowTxs(false));
                    setShowEarning(!showEarning);
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

    return (
        <div className="earn-page">
            <div className="total-earn">
                <div className="header-total-earn">Total interest earned</div>
                <div className="data-earn">
                    <div className="data-earn-value">$500.00</div>
                    <div className="data-earn-percent">+4.2</div>
                </div>
            </div>
            <div className="pro-earn">
                <div className="header-pro-earn">Pro earn</div>
                <div className="toggle-container">
                    <label className="toggle-switch">
                        <input type="checkbox" className="toggle-checkbox"
                            checked={showEarning}
                            onChange={() => dispatch(changeShowTxs(true))}
                        />
                        <span className="slider">
                            <span className="toggle-icon"></span>
                        </span>
                    </label>
                </div>
            </div>
            {showEarning &&
                <>
                    <div className='header-earn-tokens'>
                        <span className='header-text-earn-tokens'>Earning tokens</span>
                        <img alt="add-button" className='add-button' src={add_button} />
                    </div>
                    <div className='earn-tokens-container'>
                        {earnTokens.map((item, index) => (
                            <div>
                                <div className='earn-token-item' key={index}>
                                    <img className='earn-token-icon' alt={item.token} src={img[item.token.toLowerCase()]} />
                                    <img className='earn-chain-icon' alt={item.token} src={img[item.chain.toLowerCase()]} />
                                    <div className='earn-token-col-1'>
                                        <div className='earn-token-name'>{item.token}</div>
                                        <div className='earn-token-chain'>{item.chain}</div>
                                    </div>
                                    <div className='earn-token-percent'>+{item.earnPercent}</div>
                                    <div className='wrap-earn-token-col-2'>
                                        <div className='earn-token-col-2'>
                                            <div className='earn-token-amount'>
                                                {item.tokenAmount.toFixed(5)}
                                            </div>
                                            <div className='earn-token-usdt'>${item.tokenUSDT.toFixed(2)}</div>
                                        </div>
                                        <div className='wrap-arrow' onClick={() => toggleExtend(index)}>
                                            <img className={`earn-token-arrow ${index}`} alt="arrow" src={extendStates[index] ? img_lib.extended : img_lib.extend} />
                                        </div>
                                    </div>
                                </div>
                                {extendStates[index] && tokenProtocols[index].map((protocol, protocolIndex) => (
                                    <div
                                        className={`earn-token-protocol ${activeIndex[index] === protocolIndex ? 'active' : ''}`}
                                        key={protocolIndex}
                                        onClick={() => { chooseIndex(index, protocolIndex) }}
                                    >
                                        <img className='earn-token-protocol-icon' alt={protocol.name} src={img[protocol.name.toLowerCase()]} />
                                        <div className='earn-token-protocol-tvl'>
                                            <div className='header-earn-token-protocol-tvl'>TVL</div>
                                            <div className='value-earn-token-protocol-tvl'>{protocol.tvl}</div>
                                        </div>
                                        <div className='earn-token-protocol-apr'>
                                            <div className='header-earn-token-protocol-apr'>APR</div>
                                            <div className='value-earn-token-protocol-apr'>{protocol.apr}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    );
}

export default EarnPage;