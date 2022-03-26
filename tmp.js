function helloWorld() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Hello World!');
      }, 2000);
    });
  }
function helloWorld2() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Hello Everyone!');
      }, 2000);
    });
  }
   
// async function msg() {
//     Promise.all([helloWorld(), helloWorld2()]).then(values => { 
//         console.log('Message:', values[0]);
//         console.log('Message2:', values[1]);
//     });
//   }
// async function msg2() {
//     helloWorld().then(value => { 
//         console.log('Message:', value);
//         helloWorld2().then(value2 => {
//             console.log('Message2:', value2);
//          });
//     })
// }

async function msg3() {
    let msg = await helloWorld();
    let msg2 = await helloWorld2();
    console.log('aaaa')
    console.log(msg)
    console.log(msg2)

}

msg3();