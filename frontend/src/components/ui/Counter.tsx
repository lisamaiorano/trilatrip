type Props = {

    label:string

    value:number

    min:number

    max?:number

    step?:number

    onChange:(value:number)=>void

}

function Counter({

label,

value,

min,

max,

step = 1,

onChange

}:Props){

return(

<div>

<label className="font-semibold">

{label}

</label>

<div className="mt-3 flex items-center gap-6">

<button

onClick={()=>onChange(Math.max(min,value-step))}

className="
h-12
w-12
rounded-full
bg-gray-200
hover:bg-gray-300
transition
"

>

−

</button>

<span className="
text-2xl
font-bold
w-8
text-center
">

{value}

</span>

<button

onClick={()=>onChange(max !== undefined ? Math.min(max,value+step) : value+step)}

className="
h-12
w-12
rounded-full
bg-indigo-600
text-white
hover:bg-indigo-700
transition
"

>

+

</button>

</div>

</div>

)

}

export default Counter