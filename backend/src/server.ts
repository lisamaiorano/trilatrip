import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import OpenAI from "openai"

dotenv.config()
const app = express()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {

  res.json({
    message: "TrilaTrip API running 🚀"
  })

})


app.post("/api/trip", async (req,res)=>{

  const {
    destination,
    days,
    budget,
    interests
  } = req.body


  const prompt = `

Create a travel itinerary.

Destination:
${destination}

Days:
${days}

Budget:
${budget}

Interests:
${interests.join(",")}

Return a structured day-by-day plan.

`



const completion = await openai.chat.completions.create({

model:"gpt-4.1-mini",

messages:[

{
role:"user",
content:prompt
}

]

})


res.json({

itinerary:
completion.choices[0]?.message.content ?? "No itinerary generated"

})

})


app.listen(3001, () => {

  console.log(
    "🚀 TrilaTrip API running on port 3001"
  )

})