const mongoose = require("mongoose")
const connectDb = async()=>{
 try {
    await mongoose.connect(process.env.MONGODB ,{ dbName : "kaviosPix"})
    console.log("mongoDb connect")} catch (error) {
     console.log(error)}}

export default connectDb