import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/website', async (req, res) => {

})

app.get("/status/:websiteId", async (req, res) => {

})

app.post("/user/signup", async(req, res) => {

})

app.post("/user/login", async (req, res) => {
    
})

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`)
})