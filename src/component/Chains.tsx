import { useState } from "react";
import './styles/Chains.css';
import * as img_lib from '../img/index';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { changeCurrentChain, changeRpc } from "../redux/slices/chainSlice";

const listChains = [
    "Solana Mainet",
    "Solana Devnet",
    "Solana Testnet",
];
const logoChains = [
    img_lib.logo_solana,
    img_lib.logo_solana,
    img_lib.logo_solana,
];
const Rpcs = [
    "https://api.mainnet-beta.solana.com",
    "https://api.devnet.solana.com",
    "https://api.testnet.solana.com",
];

const listPages: string[] = ['token-page', 'earn-page', 'swap-page', 'activity-page'];

function Chains() {
    const pageCurrent = useSelector((state: any) => state.page.value);
    const [indexChain, setIndexChain] = useState(1);
    const [showChains, setShowChains] = useState(false);
    const dispatch = useDispatch();

    return (
        listPages.includes(pageCurrent) &&
        <div className="chains">

            <div className="current-chain"
                onClick={() => setShowChains(true)}
            >
                <img className="logo-current-chain" alt="logo-current-chain" src={logoChains[indexChain]} />
                {listChains[indexChain].toUpperCase() + " ▾"}
            </div>

            {showChains && <div className="chain-list">
                <div>All networks</div>
                {listChains.map((chain, index) => (
                    <div
                        key={index}
                        className={`chain-item ${indexChain === index ? "active" : ""}`}
                        style={{ top: `${index * 50}px` }}
                        onClick={() => {
                            setIndexChain(index);
                            setShowChains(false);
                            dispatch(changeCurrentChain(listChains[index]));
                            dispatch(changeRpc(Rpcs[index]));
                        }}
                    >
                        <img className="logo-chain-item" alt="logo-chain-item" src={logoChains[index]} />
                        <div className="content-chain-item">
                            <div className="row-1">{chain}</div>
                            <div className="row-2">{chain}</div>
                        </div>
                    </div>
                ))}
            </div>}

        </div>
    )
}

export default Chains;