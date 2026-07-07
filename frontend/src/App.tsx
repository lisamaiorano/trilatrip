import {
BrowserRouter,
Routes,
Route
} from "react-router-dom"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NewTrip from "./pages/NewTrip"
import TripResult from "./pages/TripResult"


function App(){

return(

<BrowserRouter>

<Routes>

<Route 
path="/" 
element={<Home/>}
/>


<Route 
path="/dashboard" 
element={<Dashboard/>}
/>


<Route 
path="/new-trip" 
element={<NewTrip/>}
/>

<Route 
 path="/trip-result" 
 element={<TripResult/>}
/>


</Routes>

</BrowserRouter>

)

}


export default App