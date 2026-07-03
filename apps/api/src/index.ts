import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Ok"
    })
})

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`)
})