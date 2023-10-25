let baseUrl = 'https://api-m.sandbox.paypal.com'
const base64 = require('base-64')
let clientId ='ASxR1zqBnPXtc2SEi49Z5G30ZVDdrjZ9Tc0yNvl_vUODcU2_X4x0b0e9_YiJLWFZF4Y6525eIj2XqHzE'
let secretKey = 'EAe_OA_OYLIGolFq4cwMYG6T8U7eCvEjJtKauxLAQ0BeeWQENUugG66ZbpzrXtafMpt7EFnOxIo-9LJk'
// let orderDetails = {
//     "intent": "CAPTURE",
//     "purchase_units": [
//         {
//             "items": [
//                 {
//                     "name": "T-Shirt",
//                     "description": "Green XL",
//                     "quantity": "1",
//                     "unit_amount": {
//                         "currency_code": "USD",
//                         "value": "100.00"
//                     }
//                 }
//             ],
//             "amount": {
//                 "currency_code": "USD",
//                 "value": "100.00",
//                 "breakdown": {
//                     "item_total": {
//                         "currency_code": "USD",
//                         "value": "100.00"
//                     }
//                 }
//             }
//         }
//     ],
//     "application_context": {
//         "return_url": "https://example.com/return",
//         "cancel_url": "https://example.com/cancel"
//     }
// }
const generateToken = () => {
    var headers = new Headers()
    headers.append('Content-Type','application/x-www-form-urlencoded')
    headers.append('Authorization','Basic '+base64.encode(`${clientId}:${secretKey}`))
    var requestOption = {
        method:'POST',
        headers:headers,
        body:'grant_type=client_credentials',
    }
    return new Promise((resolve,reject)=>{
        fetch(baseUrl+'/v1/oauth2/token',requestOption)
            .then(response => response.text())
            .then(result => {
                console.log("Result print: ", result)
                const {access_token} = JSON.parse(result)
                resolve(access_token)
            })
            .catch(error => {
                console.log("error raised",error)
                reject(error)
            })
    })
}
const createOrder = (token = '',orderDetails) => {
    var requestOption = {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify(orderDetails),
    }
    return new Promise((resolve,reject)=>{
        fetch(baseUrl+'/v2/checkout/orders',requestOption)
            .then(response => response.text())
            .then(result => {
                console.log("Result print: ", result)
                const res = JSON.parse(result)
                resolve(res)
            })
            .catch(error => {
                console.log("error raised",error)
                reject(error)
            })
    })
}
const capturePayment = (id, token = '') => {
    var requestOption = {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        },
    }
    return new Promise((resolve,reject)=>{
        fetch(baseUrl+`/v2/checkout/orders/${id}/capture`,requestOption)
            .then(response => response.text())
            .then(result => {
                console.log("Result print: ", result)
                const res = JSON.parse(result)
                resolve(res)
            })
            .catch(error => {
                console.log("error raised",error)
                reject(error)
            })
    })
}
export default {generateToken,createOrder,capturePayment}
