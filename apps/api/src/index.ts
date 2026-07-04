import express from 'express'
import client from '@repo/db'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'


const app = express()
const PORT = 3000

app.use(express.json())

app.post('/website', authMiddleware, async (req , res) => {
    try {
        if(!req.body.url){
            return res.status(411).json({})
        }

        if(!req.userId){
            return res.status(401).json({})
        }

        const website = await client.website.create({
            data: {
                url: req.body.url,
                user_id: req.userId,
                time_added: new Date()
            }
        })

        return res.json({ id: website.id })
    } catch (error) {
        console.log(error)
    }
})

app.get("/status/:websiteId", async (req, res) => {
    try {
        const website = await client.website.findFirst({
        where: {
            user_id: req.userId!,
            id: req.params.websiteId,
        },
        include: {
                ticks: {
                    orderBy: [{
                        createdAt: 'desc',
                    }],
                    take: 1
                }
            }
        })

        if (!website) {
            res.status(409).json({
                message: "Not found"
            })
            return;
        }

        res.json({
            url: website.url,
            id: website.id,
            user_id: website.user_id
        })

    } catch (error) {
        console.error(error)
    }
})

app.post("/user/signup", async(req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) {
            return res.status(403).json({
                message: "Username and Password are required"
            })
        }

        const user = await client.user.create({
            data: {
                username: username, 
                password: password
            }
        })

        return user
    } catch (error) {
        console.error(error)
    }
})

app.post("/user/login", async (req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) {
            return res.status(403).json({
                message: "Username and Password are required"
            })
        }

        const user = await client.user.findFirst({
            where: {
                username
            }
        })

        if(!user) {
            return res.status(403).json({
                message: "User does not exist"
            })
        }

        if(user.password !== password){
            return res.status(403).json({
                message: "Password is wrong"
            })
        }

        let token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!)

        return res.json({
            token: token
        })

    } catch (error) {
        console.error(error)
    }
})

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`)
})