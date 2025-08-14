import './styles/SwapPage.css';
import * as img_lib from '../img/index.ts'
import { useState } from 'react';

const swapProtocols = [
    {
        name: 'uniswap',
        rate: 0.11236,
        fee: '0.01 ORAI',
    },
    {
        name: 'uniswap',
        rate: 0.11236,
        fee: '0.01 ORAI',
    }
];

function SwapPage() {
    const [indexProtocol, setIndexProtocol] = useState(-1);

    return (
        <div className='swap-page'>
            <div className='swap-page-header'>UNIVERSAL SWAP</div>
            <div className='token-info'>
                <div className='token-balance'>Balance: 5 SOL</div>
                <div className='wrap-token-chain'>
                    <img className='token-chain-icon' src={img_lib.logo_solana} />
                    <div className='token-chain-name'>SOLANA</div>
                    <img className='token-chain-choose' src={img_lib.choose_icon} />
                </div>
                <div className='wrap-token'>
                    <img className='token-icon' src={img_lib.logo_solana} />
                    <div className='token-name'>SOL</div>
                    <img className='token-choose' src={img_lib.choose_icon} />
                </div>
                <input className='token-amount' type='text' placeholder='0.0' />
                <div className='token-usdt'>$0.00</div>
            </div>
            <img className='swap-icon' src={img_lib.swap_icon} />
            <div className='token-info'>
                <div className='token-balance'>Balance: 5 SOL</div>
                <div className='wrap-token-chain'>
                    <img className='token-chain-icon' src={img_lib.logo_base} />
                    <div className='token-chain-name'>BASE</div>
                    <img className='token-chain-choose' src={img_lib.choose_icon} />
                </div>
                <div className='wrap-token'>
                    <img className='token-icon' src={img_lib.logo_solana} />
                    <div className='token-name'>SOL</div>
                    <img className='token-choose' src={img_lib.choose_icon} />
                </div>
                <div className='token-amount'>0.0</div>
                <div className='token-usdt'>$0.00</div>
            </div>
            <div className='swap-button'>Swap</div>
            <div className='swap-protocols'>
                {swapProtocols.map((protocol, index) => (
                    <div className='swap-protocol'
                        onClick={() => setIndexProtocol(indexProtocol === index ? -1 : index)}
                        style={{ backgroundColor: indexProtocol === index ? "#C6EFC9" : "#c2c2c2" }}
                    >
                        <div className='protocol-col' style={{ justifyContent: "center", marginRight: '20px' }}>
                            <img className='protocol-icon' src={(img_lib as any)[`logo_${protocol.name}`]} />
                            <div className='protocol-name'>{protocol.name.toUpperCase()}</div>
                        </div>
                        <div className='protocol-col'>
                            <div className='protocol-rate-title'>Rate:</div>
                            <div className='protocol-fee-title'>Fee:</div>
                        </div>
                        <div className='protocol-col' style={{ marginLeft: "auto" }}>
                            <div className='protocol-rate' style={{ marginLeft: "auto" }}>{protocol.rate}</div>
                            <div className='protocol-fee' style={{ marginLeft: "auto" }}>{protocol.fee}</div>
                        </div>
                    </div>
                ))}
                <div className='empty-div'>Find route....</div>
            </div>
        </div>
    )
}

export default SwapPage;