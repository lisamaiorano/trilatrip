import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  Sparkles,
  MapPin,
  Calendar
} from "lucide-react"


function TripResult(){

  const location = useLocation()

const trip = location.state

  const [loading, setLoading] = useState(true)


  useEffect(()=>{

    const timer = setTimeout(()=>{

      setLoading(false)

    },3000)


    return ()=>clearTimeout(timer)

  },[])



  return (

    <div className="
      min-h-screen
      bg-gray-50
      p-10
    ">


      <div className="
        max-w-4xl
        mx-auto
      ">


      {
        loading ? (

          <div className="
            bg-white
            rounded-3xl
            p-10
            text-center
            shadow
          ">

            <Sparkles 
              className="
              mx-auto
              text-blue-600
              animate-pulse
              "
              size={50}
            />


            <h1 className="
              mt-6
              text-3xl
              font-bold
            ">
              AI is planning your trip...
            </h1>


            <p className="
              mt-3
              text-gray-600
            ">
              Finding destinations,
              activities and hidden gems 🌍
            </p>


          </div>


        ) : (


          <div>

            <h1 className="
              text-4xl
              font-bold
            ">
              Your AI itinerary ✨
            </h1>



            <div className="
              mt-8
              grid
              gap-6
            ">



              <DayCard
                day="Day 1"
                title="Arrival & City Discovery"
                description="
                Explore the city center,
                local food and main attractions.
                "
              />


              <DayCard
                day="Day 2"
                title="Culture & Experiences"
                description="
                Visit museums,
                monuments and local neighborhoods.
                "
              />


              <DayCard
                day="Day 3"
                title="Nature Adventure"
                description="
                Discover landscapes,
                parks and hidden places.
                "
              />


            </div>


          </div>


        )

      }


      </div>


    </div>

  )
}




function DayCard({
day,
title,
description
}:{
day:string
title:string
description:string
}){


return (

<div className="
bg-white
rounded-3xl
p-6
shadow
">


<div className="
flex
items-center
gap-3
text-blue-600
">

<Calendar/>

<h3 className="
font-bold
">
{day}
</h3>

</div>


<h2 className="
mt-4
text-2xl
font-bold
">

{title}

</h2>


<p className="
mt-3
text-gray-600
">

{description}

</p>


</div>

)

}



export default TripResult