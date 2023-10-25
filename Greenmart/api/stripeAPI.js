import axios from "axios";
// import {IP} from '@env'
const IP = '192.168.40.105'
const createPayment = (data) => {

    return new Promise((resolve, reject) => {
        axios.post(`http://${IP}:4848/payment-sheet`,data)
            .then(function (res){
                 resolve(res)
            })
            .catch(function (error){
                reject(error)
            })
    })
}
export default createPayment
