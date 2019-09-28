// let axios = require('axios')


// const produce = async (key, value) => {
//     try {
//         let response = await axios.post('http://131.247.3.206:8082/topics/testABDUL',
//         {
//             {'item1': true}
//         });
    
//         console.log(response.response)
//     } catch (error) {
//         console.log(error.data)
//     }
    

// }


// const getTopics = async() =>{
//     try {
//         let response = await axios.get('http://131.247.3.206:8082/topics')

//         console.log(response.response)
//     } catch (error) {
//         console.log(error.data)
//     }

// }



// produce(1, 222)

// //getTopics();

const rest = require('kafka-rest')
let kafka = new rest({'url': 'http://131.247.3.206:8082'})
let ts = Date()

const produce = async() => {
    while(true){
        ts = Date()
        let x = await kafka.topic('testABDUL').produce(`${ts}: lol`)
        console.log('ok..',Date())
    }

}

produce()