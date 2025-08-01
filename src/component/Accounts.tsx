import './styles/Accounts.css'
import { useSelector } from 'react-redux';
import * as img_lib from '../img/index'

const listPages = ['token-page', 'earn-page', 'swap-page', 'activity-page'];

function Accounts() {
    const pageCurrent = useSelector((state: any) => state.page.value);

    return (
        <>
            {listPages.includes(pageCurrent) &&
                <div className='wrap-user-logo'>
                    <img className='user-logo' src={img_lib.user} />
                </div>
            }
        </>
    );
}

export default Accounts;