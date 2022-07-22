import axios from 'axios';


export const faucetRequest = async (address = "0x0") => {
    try {
        let res = await axios.get(process.env.REACT_APP_FAUCET_API_URL + "/faucet/" + address);
        if (res.error) { throw new Error(res.error); }
        return res.data;
    } catch (ex) {
        return { error: ex.message }
    }
}