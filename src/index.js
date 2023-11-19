// Inspired by https://blog.cloudflare.com/building-a-to-do-list-with-workers-and-kv/

const html = todos => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Munch</title>
    <link rel="icon" type="image/x-icon" href="https://i.imgur.com/V3vGZfC.png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">

    <style>
    .createbutton{
      background-color: rgb(249 115 22); /* change to your desired color */
      }
      .createbutton:hover {
        background-color: rgb(251 146 60); /* change to your desired color */
    }
    </style>

    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-app-compat.js"></script>
   
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-analytics-compat.js"></script>
  
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-storage-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js"></script>
    <script src="bower_components/firebaseui/dist/firebaseui.js"></script>

    <script type="module">
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
      import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

      const firebaseApp = initializeApp({
          apiKey: FIREBASE_KEY,
          authDomain: "munch-f0a4d.firebaseapp.com",
          projectId: "munch-f0a4d",
          storageBucket: "munch-f0a4d.appspot.com",
          messagingSenderId: "765807621903",
          appId: "1:765807621903:web:db47c5f683867b3e5c307a",
          measurementId: "G-D8H5Y971ZC"
        });
      
        const auth = getAuth(firebaseApp);

        const ui = new firebaseui.auth.AuthUI(auth);

        const uiConfig = {
          signInSuccessUrl: './',
          signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            // firebase.auth.GithubAuthProvider.PROVIDER_ID,
            // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          ],
          // Terms of service url.
          tosUrl: './#tos',
          // Privacy policy url.
          privacyPolicyUrl: './#privacy',
        };

        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseuiAuthContainer', uiConfig);
      
        onAuthStateChanged(auth, user => {
          var login = document.querySelector("#firebaseuiAuthContainer")
          var loginButton = document.querySelector("#loginButton")
          var avatar = document.querySelector("#avatar")
          var username = document.querySelector("#username")
          var useremail = document.querySelector("#email")
          var signoutbutton = document.querySelector("#signOutButton")

          if (user) {
            loginButton.classList.add("hidden")
            avatar.classList.remove("hidden")
            useremail.innerText = user.email

            signoutbutton.onclick = function(){
              signOut(auth)
            }

            console.log('Logged in as ' + user.email );
            console.log(user)
            
          } else {
            loginButton.classList.remove("hidden")
            avatar.classList.add("hidden")
            console.log('No user');
          }
        });
    </script>

    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/6.1.0/firebase-ui-auth.css" />

  </head>

  <!-- Login modal -->
  <div id="loginModal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-black bg-opacity-50 max-h-full">
      <div class="relative p-4 w-full max-w-2xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Sign In to Munch
                  </h3>
                  <button type="button" id="closeLoginModal" onclick="toggleLoginModal()" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span class="sr-only">Close modal</span>
                  </button>
              </div>
              <!-- Modal body -->
              <div id="firebaseuiAuthContainer"></div>
    
              <!-- Modal footer (buttons hidden for now) -->
              <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button data-modal-hide="static-modal" type="button" class="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                  <button data-modal-hide="static-modal" type="button" class="hidden ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
              </div>
          </div>
      </div>
  </div>

  <header class="bg-white" style="background-color:rgb(249 115 22);">
  
  <nav class="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
    <div class="flex lg:flex-1 items-center justify-between w-full">
      <a href="#" class="-m-1.5 mt:0 p-1.5 hidden lg:block">
        <span class="sr-only">RIT LOGO</span>
        <img class="h-8 w-auto" src="https://www.rit.edu/brandportal/sites/rit.edu.brandportal/files/2020-04/new_RIT_logo1_w.png" alt="">
      </a>
      <div>
        <img class="h-16 w-auto" src="https://i.imgur.com/46U1Z7J.png" alt="">
      </div>
      <div id="avatar">
        <img class="w-10 h-10 rounded-full" onClick="toggleUserDropdown()" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Rounded avatar">
        <div id="userDropdown" class="hidden absolute right-0 mt-3 mr-3 w-auto overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-gray-900/5">
            <div class="px-4 py-1 mt-1 text-sm text-gray-900 dark:text-white">
              <div id="username">User logged in</div>
              <div id="email" class="font-medium truncate">name@email.com</div>
            </div>
            <ul class="hidden py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
            </ul>
            <div class="py-1">
              <button id="signOutButton" class="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
            </div>
        </div>
      </div>
      <button type="button" id="loginButton" onclick="toggleLoginModal()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <a href="#" class="text-sm font-bold leading-6 text-gray-900">Log in</a>
      </button>
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

            <select id="eventLocation" onchange="checkNotListed()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected>Location</option>
            </select>

            <div class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Location Details</div>  
            <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-wrap">
                <input id="locationInput" placeholder=" Location" class="hidden bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                <input id="roomNumInput" placeholder=" Room Number" type="number" min="0" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
              </div>
              <div class="flex items-center mb-4">
                  <input id="outsideLocation" onchange="checkOutside()" type="checkbox" value="" class="w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                  <label for="outsideLocation" class="ms-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Located outside</label>
                </div>
            </div>
            
            <div id="eventDetails" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Event Details</div>
              <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-wrap">
                <input id="hourInput" placeholder=" Approx Hours Left" type="number" min="0" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                <input id="minInput" placeholder=" Approx Minutes Left" type="number" min="0" class="hidden bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
              </div>
            </div>

            <div id="foodType" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              
            </div>
          
          <button class="createbutton text-white font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="create" type="submit">Submit</button>
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
    "Not Listed",
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
    "Greek Lawn",
    "GVC Global Village Way C",
    "GVD Global Village Way D",
    "GVE Global Village Way E",
    "GVP Global Village Plaza",
    "GWH Grace Watson Hall",
    "HAC Hale-Andrews Student Life Center",
    "HLC Hugh L. Carey Hall",
    "ICC RIT Inn & Conference Center",
    "Infinity Quad",
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
    const FIREBASE_KEY = "AIzaSyBZu64xbCwI4jZHjHYLr0xN0YqoPw8GK_M"

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

    const accordianBaseText = " accordionText flex items-left "

    var showInside = function(evt) {
      var outer = evt.currentTarget
      var target = outer.dataset.count
      var inners = document.getElementsByClassName("accordionText")

      for(i = 0; i < inners.length; i++){
          if(inners[i].id == target){
            inners[i].setAttribute("class", accordianBaseText)
          }
          else{
            inners[i].setAttribute("class", "hidden" + accordianBaseText)
          }
      }
    }

    var fillBuildings = function(){
      var buildingContainer = document.querySelector("#eventLocation")
      //console.log(buildingContainer)
      buildingContainer.innerHTML = null
      var buildingBox = document.createElement("option")
      buildingBox.innerText = "Location"
      buildingBox.setValue = "Location"
      buildingBox.setSelected = true
      buildingContainer.appendChild(buildingBox)
      for(i = 0; i < buildings.length; i++){
        var buildingAdd = document.createElement("option")
        //console.log(buildings[i])
        buildingAdd.innerText = buildings[i]
        buildingAdd.setValue = buildings[i]
        buildingContainer.appendChild(buildingAdd)
      }
    }

    var checkNotListed = function(){
      var buildingContainer = document.querySelector("#eventLocation")
      if(buildingContainer.value == "Not Listed"){
        //console.log("Other clicked")
        var locationInput = document.querySelector("#locationInput")
        locationInput.classList.remove("hidden")
        
      }
      else{
        var locationInput = document.querySelector("#locationInput")
        locationInput.classList.add("hidden")
      }
    }

    var toggleLoginModal = function(){
      var loginModal = document.querySelector("#loginModal")
      if(loginModal.classList.contains("hidden")){
        loginModal.classList.remove("hidden")
      }
      else{
        loginModal.classList.add("hidden")
      }
    }

    var toggleUserDropdown = function(){
      var dropdown = document.querySelector("#userDropdown")
      if(dropdown.classList.contains("hidden")){
        dropdown.classList.remove("hidden")
      }
      else{
        dropdown.classList.add("hidden")
      }
    }

    var checkOutside = function(){
      var checkedBox = document.querySelector("#outsideLocation")
      if(checkedBox.checked){
        //console.log("Other clicked")
        var locationInput = document.querySelector("#roomNumInput")
        locationInput.classList.add("hidden")
        
      }
      else{
        var locationInput = document.querySelector("#roomNumInput")
        locationInput.classList.remove("hidden")
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

      var otherBox = document.createElement("input")
      var other = document.createElement("input")
      var otherWrap = document.createElement("div")
      otherWrap.setAttribute("Class", "flex items-center mb-4")

      //console.log(foods[i])

      otherBox.setAttribute("type", "checkbox")
      otherBox.setAttribute("id", "default-checkbox")
      otherBox.setAttribute("Value", "otherCheckBox")
      otherBox.setAttribute("Class", "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600")

      other.setAttribute("type", "text")
      other.setAttribute("For", otherBox)
      other.setAttribute("Class", "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500")
      other.setAttribute("placeholder", "Other")
      other.setAttribute("id", "otherTextBox")
      //console.log(other)

      //console.log(otherBox)

      otherWrap.appendChild(otherBox)
      otherWrap.appendChild(other)

      foodContainer.appendChild(otherWrap)
    }

    var populateTodos = function() {
      var todoContainer = document.querySelector("#todos")
      todoContainer.innerHTML = null

      count = 0;

      window.todos.forEach(todo => {
        // display
        var el = document.createElement("button")
        el.className = "border-t py-4"
        el.className += "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-wrap items-left justify-between"
        el.dataset.todo = todo.id
        el.dataset.count = count
        el.addEventListener('click', showInside)
        var upper = document.createElement("div")
        upper.setAttribute("class",  "flex lg:flex-1 items-center justify-between w-full")
        el.appendChild(upper)

        var name = document.createElement("div")
        name.className = todo.completed ? "line-through" : ""
        name.setAttribute("style",  "font-weight: 600;")
        name.id = "name " + count 
        name.innerText = todo.name

        var xout = document.createElement("button")
        xout.type = "button"
        xout.value = count
        xout.onclick = function () {
          window.todos.splice(xout.value, 1) // remove the element
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

        //console.log(xout)


        var checkbox = document.createElement("input")
        checkbox.className = "mx-4"
        checkbox.type = "checkbox"
        checkbox.checked = todo.completed ? 1 : 0
        checkbox.addEventListener('click', completeTodo)

        var inside = document.createElement("div")
        inside.className = "hidden" + accordianBaseText
        inside.setAttribute("id", count)
        var text = document.createElement("paragraph")
        var foodOptions = todo.foods
        var newLine = \`
        \`
        if(foodOptions == null){
          foodOptions = []
        }

        text.innerText += "Location: " 
        text.innerText += todo.outside ? todo.location + " (Outside)": todo.location + ", Room " + todo.room

        const d = new Date();
        var time = d.getTime();

        // console.log("Todo Hours:" + todo.hours + " " + todo.location)

        var timeLeft = todo.hours - time

        if(timeLeft < 60000){
          //console.log("Cutting")
          window.todos.splice(count, 1)
          updateTodos()
          populateTodos()
          return // to make sure it doesn't finish rendering the finished one
        }

        console.log("Time left", timeLeft + " " + todo.location)
        var hoursLeft = Math.floor(timeLeft / 3600000)
        timeLeft -= hoursLeft * 3600 * 1000
        var minsLeft = Math.floor(timeLeft / 60000)
        var timeContent = "Time left: " + (hoursLeft > 0 ? hoursLeft + " hours and " : "") + minsLeft + " minutes"

        text.innerHTML += newLine + timeContent

        var description = foodOptions.length > 0 ? "" : newLine + "No food type specified"
        if(foodOptions.length > 0){
          description += newLine + "Food types:"
          for(i = 0; i < foodOptions.length; i++){
            description += newLine + "• " + foodOptions[i]
          } // This is how I have to do nextLine / newLine
        }

        text.innerText += description
        text.setAttribute("class", "border-t-2 border-blue-900 w-full text-left")
        inside.appendChild(text)

        //el.appendChild(checkbox)
        upper.appendChild(name)
        upper.appendChild(xout)
        el.appendChild(inside)
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
      var otherBox = document.querySelector("input[id=otherTextBox]")
      var otherCheck = document.querySelector("input[value=otherCheckBox]") 
      if(otherBox.value != null && otherCheck.checked){
        returns.push(otherBox.value)
        otherBox.value = null
        otherCheck.checked = false
      }
      return returns
    }

    var createTodo = function() {
      //submit
      
      var foodOptions = getChecked()
      var event = document.querySelector("select[id=eventType]") // This name is the name of the element -->
      var location = document.querySelector("select[id=eventLocation]") // This name is the name of the element -->
      var input = document.querySelector("#locationInput")
      var locationVal = location.value
      if(locationVal === "Not Listed"){
        if(input.value !== null && input.value !== ""){
          locationVal = input.value
          input.value = ""
        }
        else{
          locationVal = null
        }
      }
      var roomNum = document.querySelector("#roomNumInput")
      var isOutside = document.querySelector("#outsideLocation")
      var hours = document.querySelector("#hourInput")

      var hourContent = hours.value !== null && hours.value !== "" ? hours.value : 1

      const d = new Date();
      let time = d.getTime();

      var timeUp = hourContent * 3600 * 1000

      timeUp += time

      console.log(isOutside)
      if (locationVal !== "Location" && locationVal !== null && event.value !== "Event Type" && event.value !== null) {
        console.log(event.value)
        console.log(locationVal)
        var description = event.value + " at " + locationVal
        window.todos = [].concat(todos, { id: window.todos.length + 1, name: description, location: locationVal, room: roomNum.value, outside: isOutside.checked, foods: foodOptions, hours: timeUp, completed: false })
        event.value = "Event Type"
        location.value = "Location"
        roomNum.value = ""
        hours.value = ""
        isOutside.checked = false
        checkOutside()
        updateTodos()
      }
    }

    document.querySelector("#create").addEventListener('click', createTodo)
  </script>
</html>`

const defaultData = { todos: [] }

const setCache = (key, data) => EXAMPLE_DATA.put(key, data)
const getCache = key => EXAMPLE_DATA.get(key)
//const FIREBASE_KEY = FIREBASE_API_KEY
const FIREBASE_KEY = "AIzaSyBZu64xbCwI4jZHjHYLr0xN0YqoPw8GK_M"

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