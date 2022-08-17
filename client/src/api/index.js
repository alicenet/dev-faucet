import axios from 'axios';


export const faucetRequest = async (address = "0x0", isBn=false) => {
    try {
        let res = await axios.post(process.env.REACT_APP_FAUCET_API_URL + "/faucet", {
            address: address,
            curve: isBn ? 2 : 1
        });
        if (res.error) { throw new Error(res.error); }
        return res.data;
    } catch (ex) {
        return { error: ex.message }
    }
}