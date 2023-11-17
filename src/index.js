// Inspired by https://blog.cloudflare.com/building-a-to-do-list-with-workers-and-kv/

const html = todos => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Munch</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">

  </head>

  <header class="bg-white">
  <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
    <div class="flex lg:flex-1">
      <a href="#" class="-m-1.5 p-1.5">
        <span class="sr-only">Your Company</span>
        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
      </a>
      <span class="self-center ml-5 text-xl font-semibold whitespace-nowrap dark:text-white">Company Name</span>
    </div>
    </nav>
    </header>

  <body class="bg-blue-100">
    <div class="w-full flex content-center justify-evenly lg:flex-row flex-col mt-8">
      <div class="bg-white h-full shadow-md rounded px-8 pt-6 py-8 mb-4">
        <h1 class="block text-grey-800 text-md font-bold mb-2">Submit a New Food Event!</h1>
        <div class="flex" style="flex-direction:column">
          <! -- <input class="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-grey-800 leading-tight focus:outline-none focus:shadow-outline" type="text" name="second" placeholder="A new todo"></input>
          
            <select id="eventType" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected>Event Type</option>
              <option value="Free Food">Free food</option>
              <option value="Food for awareness">Food to raise awareness</option>
              <option value="Party with food">Party with food</option>
              <option value="Bake sale">Bake sale</option>
              <option value="Fundraiser">Fundraiser</option>
            </select>

            <select id="eventLocation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected>Location</option>
            </select>

            <div id="foodType" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              
            </div>
          
          <button class="bg-blue-500 hover:bg-blue-800 text-white font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="create" type="submit">Create</button>
        </div>

        
<div id="accordion-collapse" data-accordion="collapse">
<h2 id="accordion-collapse-heading-1">
  <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
    <span>What is Flowbite?</span>
    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
    </svg>
  </button>
</h2>
<div id="accordion-collapse-body-1" class="hidden" aria-labelledby="accordion-collapse-heading-1">
  <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
    <p class="mb-2 text-gray-500 dark:text-gray-400">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
    <p class="text-gray-500 dark:text-gray-400">Check out this guide to learn how to <a href="/docs/getting-started/introduction/" class="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p>
  </div>
</div>
<h2 id="accordion-collapse-heading-2">
  <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2">
    <span>Is there a Figma file available?</span>
    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
    </svg>
  </button>
</h2>
<div id="accordion-collapse-body-2" class="hidden" aria-labelledby="accordion-collapse-heading-2">
  <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
    <p class="mb-2 text-gray-500 dark:text-gray-400">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
    <p class="text-gray-500 dark:text-gray-400">Check out the <a href="https://flowbite.com/figma/" class="text-blue-600 dark:text-blue-500 hover:underline">Figma design system</a> based on the utility classes from Tailwind CSS and components from Flowbite.</p>
  </div>
</div>
<h2 id="accordion-collapse-heading-3">
  <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-3" aria-expanded="false" aria-controls="accordion-collapse-body-3">
    <span>What are the differences between Flowbite and Tailwind UI?</span>
    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
    </svg>
  </button>
</h2>
<div id="accordion-collapse-body-3" class="hidden" aria-labelledby="accordion-collapse-heading-3">
  <div class="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
    <p class="mb-2 text-gray-500 dark:text-gray-400">The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.</p>
    <p class="mb-2 text-gray-500 dark:text-gray-400">However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no technical reason stopping you from using the best of two worlds.</p>
    <p class="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
    <ul class="ps-5 text-gray-500 list-disc dark:text-gray-400">
      <li><a href="https://flowbite.com/pro/" class="text-blue-600 dark:text-blue-500 hover:underline">Flowbite Pro</a></li>
      <li><a href="https://tailwindui.com/" rel="nofollow" class="text-blue-600 dark:text-blue-500 hover:underline">Tailwind UI</a></li>
    </ul>
  </div>
</div>
</div>


      </div>

      <div class="h-full bg-white shadow-md rounded px-8 pt-6 py-8 mb-4">
        <h1 class="block text-grey-800 text-md font-bold mb-2">Current Food Events</h1>
        <div class="mt-4" id="todos"></div>
      </div>
    </div>
  </body>

  <script>
  const buildings = [
    "905 Annex V",
    "906 Annex VI",
    "907 Annex VII",
    "908 Annex VIII",
    "909 Annex IX",
    "AUG August Center",
    "BHA Frances Baker Hall A",
    "BHB Frances Baker Hall B",
    "BLC Bausch & Lomb Center",
    "BOO James E. Booth Hall",
    "BRN Brown Hall",
    "CAR Chester F. Carlson Center for Imaging Science",
    "CBT Center for Bioscience Education & Technology",
    "CGH Carlton Gibson Hall",
    "CHA Eugene Colby Hall A",
    "CHB Eugene Colby Hall B",
    "CHC Eugene Colby Hall E",
    "CHD Eugene Colby Hall D",
    "CHE Eugene Colby Hall E",
    "CHF Eugene Colby Hall (F)",
    "CLK George H. Clark Gymnasium",
    "COL Munsell Color Science Laboratory",
    "CPC Campus Center",
    "CRS Crossroads",
    "CSD Student Development Center",
    "CYB Cybersecurity Hall",
    "DSP Fredericka Douglass Sprague Perry Hall",
    "EAS George Eastman Hall",
    "ENG Engineering Hall",
    "ENT Engineering Technology Hall",
    "FHA Helen Fish Hall (A)",
    "FHB Helen Fish Hall B",
    "FHC Helen Fish Hall C",
    "FMS Facilities Management Services",
    "FNK 40 Franklin Street",
    "GAN Frank E. Gannett Hall",
    "GHA Greek House A - Zeta Tau Alpha",
    "GHB Greek House B - Delta Phi Epsilon",
    "GHC Greek House C - Alpha Sigma Alpha",
    "GHD Greek House D - Phi Kappa Psi",
    "GHE Greek House E - Alpha Xi Delta",
    "GHF Greek House F - Pi Kappa Phi",
    "GLE James E. Gleason Hall",
    "GOB Gosnell Boathouse",
    "GOL Golisano Hall",
    "GOR Gordon Field House & Activities Center",
    "GOS Thomas Gosnell Hall",
    "GVC Global Village Way C",
    "GVD Global Village Way D",
    "GVE Global Village Way E",
    "GVP Global Village Plaza",
    "GWH Grace Watson Hall",
    "HAC Hale-Andrews Student Life Center",
    "HLC Hugh L. Carey Hall",
    "ICC RIT Inn & Conference Center",
    "INS Institute Hall",
    "JEF 175 Jefferson Road",
    "KGH Kate Gleason Hall",
    "LAC Laboratory for Applied Computing",
    "LBJ Lyndon Baines Johnson Hall",
    "LBR Liberal Arts Hall",
    "LEL Leenhouts Lodge at the Tait Preserve",
    "LH Liberty Hill",
    "LOB Joseph M. Lobozzo Alumni House",
    "LOW Max Lowenthal Hall",
    "MEH Mark Ellingson Hall",
    "MON Monroe Hall",
    "MPT Music Performance Theater",
    "MSS MAGIC Spell Studios",
    "OBS Observatory House",
    "ORN Orange Hall",
    "PGA Perkins Green Apartments",
    "POL Gene Polisseni Center",
    "PPD 100 Park Point Drive",
    "PTH Peter Peterson Hall",
    "RED Red Barn",
    "RHA Residence Hall A",
    "RHB Residence Hall B",
    "RHC Residence Hall C",
    "RHD Residence Hall D",
    "RIA Frank Ritter Ice Arena",
    "RKA Riverknoll Apartments",
    "ROS Lewis P. Ross Hall",
    "RSC Rosica Hall",
    "SAN Sands Family Studios",
    "SAU Student Alumni Union",
    "SHD Student Hall for Exploration and Development",
    "SHH Sol Heumann Hall",
    "SIH Student Innovation Hall",
    "SLA Louise Slaughter Hall",
    "SMT Schmitt Interfaith Center",
    "SUS Sustainability Institute Hall",
    "TPD 125 Tech Park Drive",
    "UCS University Commons Suites",
    "UNI University Gallery",
    "USC University Services Center",
    "VIG Vignelli Center for Design Studies",
    "VRB Vehicle Repair Building",
    "WAL Wallace Library",
    "WEL Welcome Center",]

    const foods = ["Candy", "Snacks", "Pizza", "Desserts"]

    window.todos = ${todos || []}

    var updateTodos = function() {
      fetch("/", { method: 'PUT', body: JSON.stringify({ todos: window.todos }) })
      populateTodos()
    }

    var completeTodo = function(evt) {
      var checkbox = evt.target
      var todoElement = checkbox.parentNode
      var newTodoSet = [].concat(window.todos)
      var todo = newTodoSet.find(t => t.id == todoElement.dataset.todo)
      todo.completed = !todo.completed
      window.todos = newTodoSet
      updateTodos()
    }

    var fillBuildings = function(){
      var buildingContainer = document.querySelector("#eventLocation")
      console.log(buildingContainer)
      buildingContainer.innerHTML = null
      var buildingBox = document.createElement("option")
      buildingBox.innerText = "Location"
      buildingBox.setValue = "Location"
      buildingBox.setSelected = true
      buildingContainer.appendChild(buildingBox)
      for(i = 0; i < buildings.length; i++){
        var buildingAdd = document.createElement("option")
        console.log(buildings[i])
        buildingAdd.innerText = buildings[i]
        buildingBox.setValue = buildings[i]
        buildingContainer.appendChild(buildingAdd)
      }
    }

    var fillFoods = function(){
      var foodContainer = document.querySelector("#foodType")
      console.log(foodContainer)
      foodContainer.innerHTML = null

      var title = document.createElement("div")
      title.innerText = "Food Types Available"
      title.setAttribute("Class", "ms-2 mb-5 text-sm font-medium text-gray-900 dark:text-gray-300")
      foodContainer.appendChild(title)
      
      for(i = 0; i < foods.length; i++){
        var foodAdd = document.createElement("input")
        var foodLabel = document.createElement("label")
        var foodWrap = document.createElement("div")
        foodWrap.setAttribute("Class", "flex items-center mb-4")

        console.log(foods[i])

        foodAdd.setAttribute("type", "checkbox")
        foodAdd.setAttribute("id", "default-checkbox")
        foodAdd.setAttribute("Value", foods[i])
        foodAdd.setAttribute("Class", "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600")


        foodLabel.setAttribute("For", foodAdd)
        foodLabel.setAttribute("Class", "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300")
        foodLabel.setAttribute("Value",  foods[i])
        foodLabel.innerText = '\xa0' + foods[i] 
        //console.log(foodLabel)

        //console.log(foodAdd)

        foodWrap.appendChild(foodAdd)
        foodWrap.appendChild(foodLabel)

        foodContainer.appendChild(foodWrap)
      }
    }

    var populateTodos = function() {
      var todoContainer = document.querySelector("#todos")
      todoContainer.innerHTML = null

      count = 0;

      window.todos.forEach(todo => {
        var el = document.createElement("div")
        el.className = "border-t py-4"
        el.className += "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex items-center justify-between"
        el.dataset.todo = todo.id

        var name = document.createElement("span")
        name.className = todo.completed ? "line-through" : ""
        name.innerText = todo.name

        var xout = document.createElement("button")
        xout.type = "button"
        xout.value = count
        xout.onclick = function () {
          window.todos.splice(xout.value, 1)
          updateTodos()
        }
        xout.className = "bg-white rounded-md p-2 inline-flex items-center justify-right text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"

        var ximg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        ximg.setAttribute("class", "h-2 w-2")
        ximg.setAttribute("fill",  "none")
        ximg.setAttribute("viewBox",  "0 0 24 24")
        ximg.setAttribute("stroke",  "currentColor")

        var stroke = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        stroke.setAttribute("stroke-linecap", "round")
        stroke.setAttribute("stroke-linejoin", "round")
        stroke.setAttribute("stroke-width",  "2")
        stroke.setAttribute("d", "M6 18L18 6M6 6l12 12")

        ximg.appendChild(stroke)

        xout.appendChild(ximg)

        console.log(xout)


        var checkbox = document.createElement("input")
        checkbox.className = "mx-4"
        checkbox.type = "checkbox"
        checkbox.checked = todo.completed ? 1 : 0
        checkbox.addEventListener('click', completeTodo)

        //el.appendChild(checkbox)
        el.appendChild(name)
        el.appendChild(xout)
        todoContainer.appendChild(el)
        count ++
      })
    }

    populateTodos()
    fillBuildings()
    fillFoods()

    var getChecked = function() {
      var returns = []
      for(i = 0; i < foods.length; i++){
        var box = document.querySelector("input[value=" + CSS.escape(foods[i]) + "]")
        //console.log(box.checked)
        if(box.checked){
          box.checked = false;
          returns.push(foods[i])
        }
      }
      return returns
    }

    var createTodo = function() {
      var foodOptions = getChecked()
      var event = document.querySelector("select[id=eventType]") // This name is the name of the element -->
      var location = document.querySelector("select[id=eventLocation]") // This name is the name of the element -->
      if (location.value !== "Location" && location.value !== null && event.value !== "Event Type" && event.value !== null) {
        console.log(event.value)
        console.log(location.value)
        var description = event.value + " at " + location.value
        if(foodOptions.length > 0){
          description += " (Foods:"
          for(i = 0; i < foodOptions.length; i++){
            description += " " + foodOptions[i]
          }
          description += ")"
        }
        window.todos = [].concat(todos, { id: window.todos.length + 1, name: description, completed: false })
        event.value = "Event Type"
        location.value = "Location"
        updateTodos()
      }
    }

    document.querySelector("#create").addEventListener('click', createTodo)
  </script>
</html>`

const defaultData = { todos: [] }

const setCache = (key, data) => EXAMPLE_DATA.put(key, data)
const getCache = key => EXAMPLE_DATA.get(key)

async function getTodos(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  //const cacheKey = `data-${ip}`
   const cacheKey = 1
  let data
  const cache = await getCache(cacheKey)
  if (!cache) {
    await setCache(cacheKey, JSON.stringify(defaultData))
    data = defaultData
  } else {
    data = JSON.parse(cache)
  }
  const body = html(JSON.stringify(data.todos || []))
  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function updateTodos(request) {
  const body = await request.text()
  const ip = request.headers.get('CF-Connecting-IP')
  //const cacheKey = `data-${ip}`
  const cacheKey = 1
  try {
    JSON.parse(body)
    await setCache(cacheKey, body)
    return new Response(body, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function handleRequest(request) {
  if (request.method === 'PUT') {
    return updateTodos(request)
  } else {
    return getTodos(request)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})