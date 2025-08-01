import './styles/Transaction.css'
import * as img_lib from '../img/index'
import { useSelector } from 'react-redux';

const generateRandomMessage = (length: number = 2000): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let message = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        message += characters[randomIndex];
        if ((i + 1) % 38 === 0)
            message += ' ';
    }
    return message;
};

const randomMessage = generateRandomMessage();

function Transaction() {
    const currChain = useSelector((state: any) => state.chain.curr);
    const showTxs = useSelector((state: any) => state.txs.show);

    return (
        <>
            <div className='notify-txs'></div>
            {showTxs &&
                <div className='transaction'>
                    <div className='approve-title'>APPROVE TRANSACTION</div>
                    <div className='message-title'>Messages:</div>
                    <div className='wrap-message'>{randomMessage}</div>
                    <div className='network-tx'>
                        <div>Network</div>
                        <div className='tail-network-tx'>
                            <img src={img_lib.logo_solana} style={{ height: '30px' }} />
                            {currChain}
                        </div>
                    </div>
                    <div className='fee-tx'>
                        Est.Fee
                        <div className='tail-fee-tx'>
                            <div>{'0 SOL(-)'}</div>
                            {/* <div style={{ fontSize: '12px', color: '#bfbcbc' }}>$0.92</div> */}
                        </div>
                    </div>
                    <div className='reject-button'>Reject</div>
                    <div className='approve-button'>Approve</div>
                </div>
            }
        </>
    )
}

export default Transaction;