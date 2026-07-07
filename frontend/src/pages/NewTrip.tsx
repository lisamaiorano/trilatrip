
import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { generateTrip } from "../api/tripApi"

import {
  MapPin,
  Calendar,
  Wallet,
  Sparkles
} from "lucide-react"

type Trip = {
  destination: string
  days: string
  budget: string
  interests: string[]
}
function NewTrip(){

const [trip, setTrip] = useState<Trip>({
  destination: "",
  days: "",
  budget: "",
  interests: []
})

const navigate = useNavigate()

return (

<div className="
min-h-screen
bg-gray-50
p-10
">


<div className="
max-w-3xl
mx-auto
">


<h1 className="
text-4xl
font-bold
text-gray-900
">

Create a new trip ✈️

</h1>


<p className="
mt-3
text-gray-600
">

Tell us your preferences and let AI
build your perfect itinerary.

</p>



<div className="
mt-10
bg-white
rounded-3xl
p-8
shadow-sm
space-y-6
">



{/* Destination */}

<div>

<label className="
flex
items-center
gap-2
font-semibold
">

<MapPin size={20}/>
Destination

</label>


<input

placeholder="Example: Japan"

value={trip.destination}

onChange={(e)=>
  setTrip({
    ...trip,
    destination:e.target.value
  })
}

className="
mt-3
w-full
rounded-xl
border
p-4
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>



{/* Days */}

<div>

<label className="
flex
items-center
gap-2
font-semibold
">

<Calendar size={20}/>
Days

</label>


<input

type="number"

placeholder="10"

value={trip.days}

onChange={(e)=>
setTrip({
...trip,
days:e.target.value
})
}

className="
mt-3
w-full
rounded-xl
border
p-4
"

/>

</div>



{/* Budget */}

<div>

<label className="
flex
items-center
gap-2
font-semibold
">

<Wallet size={20}/>
Budget

</label>


<input

placeholder="2500 €"

value={trip.budget}

onChange={(e)=>
setTrip({
...trip,
budget:e.target.value
})
}

className="
mt-3
w-full
rounded-xl
border
p-4
"

/>

</div>



{/* Interests */}

<div>

<h3 className="
font-semibold
">

Your interests

</h3>


<div className="
grid
grid-cols-2
gap-3
mt-4
">


{
[
"Nature 🌲",
"Food 🍜",
"Culture 🏛️",
"Adventure 🏔️",
"Nightlife 🌙",
"Relax 🏖️"
].map((item)=>(

<label
key={item}
className="
border
rounded-xl
p-3
cursor-pointer
hover:bg-blue-50
"
>

<input

type="checkbox"

onChange={(e)=>{

const selected=item

if(e.target.checked){

setTrip({
...trip,
interests:[
...trip.interests,
selected
]
})

}

else{

setTrip({
...trip,
interests:
trip.interests.filter(
(i)=>i!==selected
)
})

}

}}

/>

{item}

</label>

))

}


</div>

</div>



<button 

onClick={async()=>{


try {


const result = await generateTrip(trip)


console.log(result)


navigate("/trip-result",{
state:result
})


}
catch(error){

console.log(error)

}


}}

className="
mt-6
flex
items-center
justify-center
gap-2
w-full
rounded-xl
bg-blue-600
py-4
text-white
font-semibold
hover:bg-blue-700
transition
">

<Sparkles/>

Generate my trip

</button>



</div>


</div>


</div>

)

}


export default NewTrip