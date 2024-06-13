// const delay = (ms) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//         resolve(`等待了 ${ms} 毫秒`);
//         }, ms);
//     });
// };
// const delay2 = (ms) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//         resolve(`等待了 ${ms} 毫秒结果`);
//         }, ms);
//     });
// };

// delay(2000)
//     .then((message) => {
//         console.log(message);
//     })
//     .catch((error) => {
//         console.error(error);
//     });

// delay2(2000)
//     .then((message) => {
//         console.log(message);
//     })
//     .catch((error) => {
//         console.error(error);
//     });





let a = "123abc"
const b = "123abcd"

a = a.concat(b)

console.log(a)
console.log(b)

a = a.replace(/\d\d\w/g,'')
console.log(a)

let aa = a.slice(0,2)
console.log(aa)

aa = aa + a
console.log(aa)
