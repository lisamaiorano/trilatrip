import {
  Plane,
  Plus,
  MapPin,
  Wallet
} from "lucide-react"


function Dashboard(){

  return (

    <div className="min-h-screen bg-gray-50">


      {/* Sidebar */}

      <aside className="
        fixed
        left-0
        top-0
        h-screen
        w-64
        bg-white
        border-r
        p-6
      ">


        <div className="
          flex
          items-center
          gap-2
          text-2xl
          font-bold
          text-blue-600
        ">
          <Plane />
          TrilaTrip
        </div>


        <nav className="mt-10 space-y-4">

          <p className="text-gray-600">
            Dashboard
          </p>

          <p className="text-gray-600">
            My Trips
          </p>

          <p className="text-gray-600">
            Profile
          </p>

        </nav>


      </aside>



      {/* Content */}

      <main className="
        ml-64
        p-10
      ">


        <h1 className="
          text-4xl
          font-bold
          text-gray-900
        ">
          Welcome back 👋
        </h1>


        <p className="
          mt-3
          text-gray-600
        ">
          Ready for your next adventure?
        </p>



        {/* Stats */}

        <section className="
          mt-10
          grid
          grid-cols-3
          gap-6
        ">


          <StatCard
            icon={<MapPin />}
            title="Trips"
            value="3"
          />


          <StatCard
            icon={<Wallet />}
            title="Budget"
            value="€4500"
          />


          <StatCard
            icon={<Plane />}
            title="Countries"
            value="5"
          />


        </section>



        {/* Trips */}

        <section className="mt-12">


          <h2 className="
            text-2xl
            font-bold
          ">
            Your trips
          </h2>



          <div className="
            mt-6
            grid
            grid-cols-2
            gap-6
          ">


            <TripCard
              country="China 🇨🇳"
              days="12 days"
              budget="€3000"
            />


            <TripCard
              country="Japan 🇯🇵"
              days="10 days"
              budget="€2200"
            />


          </div>


        </section>



      </main>


    </div>

  )
}



function StatCard({
  icon,
  title,
  value
}:{
  icon: React.ReactNode
  title:string
  value:string
}){


return (

<div className="
 bg-white
 rounded-2xl
 p-6
 shadow-sm
">

<div className="text-blue-600">
{icon}
</div>

<p className="mt-4 text-gray-500">
{title}
</p>

<h3 className="text-3xl font-bold">
{value}
</h3>

</div>

)

}




function TripCard({
 country,
 days,
 budget
}:{
 country:string
 days:string
 budget:string
}){


return (

<div className="
 bg-white
 rounded-3xl
 p-6
 shadow-sm
 hover:shadow-lg
 transition
">


<h3 className="
 text-2xl
 font-bold
">
{country}
</h3>


<p className="mt-3 text-gray-600">
{days}
</p>


<p className="mt-2 text-gray-600">
{budget}
</p>


<button className="
 mt-5
 flex
 items-center
 gap-2
 rounded-full
 bg-blue-600
 px-5
 py-2
 text-white
">

<Plus size={18}/>
View trip

</button>


</div>

)

}



export default Dashboard