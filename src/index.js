// Inspired by https://blog.cloudflare.com/building-a-to-do-list-with-workers-and-kv/

const html = todos => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Munch</title>
    <link rel="icon" type="image/x-icon" href="https://i.imgur.com/V3vGZfC.png">
    
    <!-- Get rid of the min below to see the full style sheet -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">

    <style>
    .createbutton{
      background-color: rgb(249 115 22); /* change to your desired color */
      }
      .createbutton:hover {
        background-color: rgb(251 146 60); /* change to your desired color */
    }
    </style>

    <!-- Map style pieces -->
    <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
    <style>
      #map {
        height: 40vh; 
        width: 100%; 
      }

      .locate {
        top: 4em;
        left: .5em;
      }
    </style>

    <!-- Map-related files -->
    <script src="https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css">

    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-app-compat.js"></script>
   
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-analytics-compat.js"></script>
  
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0-beta.5/firebase-storage-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js"></script>

    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/6.1.0/firebase-ui-auth.css" />

  </head>

  <!-- Unhide this button to test basic firebasing -->
  <button id="userNumButton" class="hidden"></button>

  <!-- Login modal -->
  <div id="loginModal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50 max-h-full">
      <div class="relative p-4 w-full max-w-2xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Sign In to Munch
                  </h3>
                  <button type="button" id="closeLoginModal" class="loginComponent text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
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
      <a href="https://www.rit.edu/" class="-m-1.5 mt:0 p-1.5 hidden lg:block">
        <span class="sr-only">RIT LOGO</span>
        <img class="h-8 w-auto" src="https://www.rit.edu/brandportal/sites/rit.edu.brandportal/files/2020-04/new_RIT_logo1_w.png" alt="">
      </a>
      <div>
        <img class="h-16 w-auto" src="https://i.imgur.com/46U1Z7J.png" alt="">
      </div>
      <div id="avatar" class="hidden">
        <img id="avatarImg" class="avatar w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" referrerpolicy="no-referrer" alt="Rounded avatar">
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
      <button type="button" id="loginButton" class="hidden loginComponent bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <a href="#" class="text-sm font-bold leading-6 text-gray-900">Log in</a>
      </button>
    </div>
    </nav>
    </header>

  <body class="bg-blue-100" style="height: 100vh">
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

            <div class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Location Details</div>  
            <div class="ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-wrap">
                <input id="locationInput" placeholder=" Location" class="hidden bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                <input id="roomNumInput" placeholder=" Room Number" type="number" min="0" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto ml-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
              </div>
              <div class="flex items-center mb-4">
                  <input id="outsideLocation" type="checkbox" value="" class="w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
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
        <div id="map" class="mt-4"></div>
      </div>

    </div>
  </body>
    
  <!-- https://flowbite.com/docs/components/footer/ -->
  <footer class="bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Munch. Email questions to <b>munchrit@gmail.com</b>
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <p>&nbsp;|&nbsp;<a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a></p>
        </li>
        <li>
            <p>&nbsp;|&nbsp;<a href="#" class="hover:underline me-4 md:me-6">Licensing</a></p>
        </li>
        <li>
            <p>&nbsp;|&nbsp;<a href="mailto: munchrit@gmail.com" class="hover:underline">Contact</a></p>
        </li>
    </ul>
</footer>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
    import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
    import { getDatabase, ref, child, set, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js'

    // Begin firebase auth code
    const firebaseApp = initializeApp({
        apiKey: "AIzaSyBZu64xbCwI4jZHjHYLr0xN0YqoPw8GK_M",
        authDomain: "munch-f0a4d.firebaseapp.com",
        projectId: "munch-f0a4d",
        storageBucket: "munch-f0a4d.appspot.com",
        messagingSenderId: "765807621903",
        appId: "1:765807621903:web:db47c5f683867b3e5c307a",
        measurementId: "G-D8H5Y971ZC",
        databaseURL: "https://munch-f0a4d-default-rtdb.firebaseio.com/"
      });
    
      const auth = getAuth(firebaseApp);

      function startUpWithCurrent(){
        const user = auth.currentUser;
        runStartUp(user)
      }

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
        'signInFlow': 'popup',
      };

      // The start method will wait until the DOM is loaded.

      //signInWithEmailAndPassword(auth, "jthirdextra@gmail.com", "Password123")

      function runStartUp ( user ){
        const database = getDatabase(firebaseApp);

        const loadUser = ref(database, 'users/' + user.uid);
        onValue(loadUser, (snapshot) => { // if this is not being called, it's a security issue
          var currentUser = {}
          var userNum = 0;
          var votes = {}
          
          var nameBlocks = document.getElementsByClassName("nameBlock")
          for(let i = 0; i < nameBlocks.length; i++){ // set the user votes to the current blocks
            //console.log(nameBlocks[i])
            //votes[nameBlocks[i].dataset.track] = nameBlocks[i].dataset.votes // we dont want the total number of votes
            votes[nameBlocks[i].dataset.track] = 0
          }
          console.log("Votes", votes)

          if(snapshot.val() !== null){
            currentUser = snapshot.val();

            userNum = currentUser.usernum
            console.log("Current user", currentUser)
            if(currentUser.uservotes){
              for (const [key, value] of Object.entries(currentUser.uservotes)) { // set votes equal to the users votes
                if(key in votes){
                  votes[key] = value
                }
                else{ // if there are votes that don't exist any more, delete them
                  delete currentUser.uservotes[key] // changed locally
                  set(ref(database, 'users/' + user.uid), currentUser);
                }
              }
            }
            else{
              currentUser.uservotes = votes
              set(ref(database, 'users/' + user.uid), currentUser);
            }
          }
          else { // first time this user id is seen
            var user_data = {
              username: user.displayName,
              useremail: user.email,
              usernum: 0,
              uservotes: votes,
            }
            set(ref(database, 'users/' + user.uid), user_data);
          }

          var numButton = document.querySelector("#userNumButton")
          numButton.innerText = userNum
          console.log("set user num to", userNum)
          numButton.onclick = function(){
            set(ref(database, 'users/' + user.uid + '/usernum'), userNum + 1);
            numButton.innerText = userNum + 1
          }

          var upVoteButtons = document.getElementsByName("upV")
          for(let i = 0; i < upVoteButtons.length; i++){
            if(votes[upVoteButtons[i].id.substring(1)] === 1){
              for (const child of upVoteButtons[i].children) {
                child.setAttribute("stroke", "orange")
              }
            }
            upVoteButtons[i].onclick = function(evt) {
              var button = evt.currentTarget

              if(votes[button.id.substring(1)] !== 1){
                if(votes[button.id.substring(1)] == -1){
                  addUpVote(button.dataset.count)
                }
                votes[button.id.substring(1)] = 1;
                currentUser.uservotes = votes
                console.log("Current user", currentUser)
                set(ref(database, 'users/' + user.uid), currentUser); // sync changes to main

                for (const child of button.children) {
                  child.setAttribute("stroke", "orange")
                }
                var downButton = document.querySelector("[name='downV'][id='d" + button.id.substring(1) + "']")
                for (const child of downButton.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                addUpVote(button.dataset.count)
              }
              else{
                votes[button.id.substring(1)] = 0;
                currentUser.uservotes = votes
                console.log("Current user", currentUser)
                set(ref(database, 'users/' + user.uid), currentUser); // sync changes to main

                for (const child of button.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                var downButton = document.querySelector("[name='downV'][id='d" + button.id.substring(1) + "']")
                for (const child of downButton.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                addDownVote(button.dataset.count)
              }
            } // end upvote button function
          }
          var downVoteButtons = document.getElementsByName("downV")
          for(let i = 0; i < downVoteButtons.length; i++){
            if(votes[downVoteButtons[i].id.substring(1)] === -1){
              for (const child of downVoteButtons[i].children) {
                child.setAttribute("stroke", "orange")
              }
            }
            downVoteButtons[i].onclick = function(evt) {
              var button = evt.currentTarget
              
              if(votes[button.id.substring(1)] !== -1){
                if(votes[button.id.substring(1)] == 1){
                  addDownVote(button.dataset.count)
                }
                votes[button.id.substring(1)] = -1;
                currentUser.uservotes = votes
                set(ref(database, 'users/' + user.uid), currentUser); // sync changes to main

                for (const child of button.children) {
                  child.setAttribute("stroke", "orange")
                }
                var downButton = document.querySelector("[name='upV'][id='u" + button.id.substring(1) + "']")
                for (const child of downButton.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                addDownVote(button.dataset.count)
              } 
              else{
                votes[button.id.substring(1)] = 0;
                currentUser.uservotes = votes
                console.log("Current user", currentUser)
                set(ref(database, 'users/' + user.uid), currentUser); // sync changes to main

                for (const child of button.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                var downButton = document.querySelector("[name='downV'][id='d" + button.id.substring(1) + "']")
                for (const child of downButton.children) {
                  child.setAttribute("stroke", "currentColor")
                }
                addUpVote(button.dataset.count)
              }
            } // end downvote button function
          }
        }, // end snapshot logic
        error => {
          console.log("Error", error)
        }); // end loaded user logic

        var username = document.querySelector("#username")
        var useremail = document.querySelector("#email")
        var signoutbutton = document.querySelector("#signOutButton")
        var avatarImg = document.querySelector("#avatarImg")

        loginButton.classList.add("hidden")
        avatar.classList.remove("hidden")
        useremail.innerText = user.email

        if(user.photoURL){
          avatarImg.src = user.photoURL
        }

        if(!user.usernum){
          user.usernum = 0
        }

        signoutbutton.onclick = function(){
          signOut(auth)
        }

        console.log('Logged in as ' + user.email );
        console.log("User:", user)
      }
    
      onAuthStateChanged(auth, user => {
        var login = document.querySelector("#firebaseuiAuthContainer")
        var loginButton = document.querySelector("#loginButton")
        var avatar = document.querySelector("#avatar")

        if (user) {
          runStartUp(user)
        } else {
          ui.start('#firebaseuiAuthContainer', uiConfig);
          loginButton.classList.remove("hidden")
          avatar.classList.add("hidden")
          console.log('No user');
        }
      }, error => {
        console.log("error")
      });
    
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

    const coords = {
      "Not Listed": [0,0],
      "905 Annex V": [0,0],
      "906 Annex VI": [0,0],
      "907 Annex VII": [0,0],
      "908 Annex VIII": [0,0],
      "909 Annex IX": [0,0],
      "AUG August Center": [43.08417929383888, -77.67212814056265],
      "BHA Frances Baker Hall A": [43.08408914897436, -77.66943073414521],
      "BHB Frances Baker Hall B": [43.084081447762095, -77.66866098416261],
      "BLC Bausch & Lomb Center": [43.086024045600404, -77.67542248857849],
      "BOO James E. Booth Hall": [43.084961253106776, -77.67717308064377],
      "BRN Brown Hall": [43.081955901817594, -77.67843045335812],
      "CAR Chester F. Carlson Center for Imaging Science": [43.085904342527634, -77.67767046096698],
      "CBT Center for Bioscience Education & Technology": [43.08561689994638, -77.6785541406307],
      "CGH Carlton Gibson Hall": [43.08572044084291, -77.6677090445869],
      "CHA Eugene Colby Hall A": [0,0],
      "CHB Eugene Colby Hall B": [0,0],
      "CHC Eugene Colby Hall E": [0,0],
      "CHD Eugene Colby Hall D": [0,0],
      "CHE Eugene Colby Hall E": [0,0],
      "CHF Eugene Colby Hall (F)": [0,0],
      "CLK George H. Clark Gymnasium": [43.08458099105695, -77.67390470060036],
      "COL Munsell Color Science Laboratory": [43.08241149888393, -77.67891166721117],
      "CPC Campus Center": [43.0841147612565, -77.67386807083561],
      "CRS Crossroads": [43.08257690935789, -77.68014265587533],
      "CSD Student Development Center": [43.087137194230024, -77.66831800733759],
      "CYB Cybersecurity Hall": [43.08389120087585, -77.68063985857214],
      "DSP Fredericka Douglass Sprague Perry Hall": [43.0849309621486, -77.66753553823415],
      "EAS George Eastman Hall": [43.08472979548091, -77.67533437279671],
      "ENG Engineering Hall": [43.08444322336611, -77.67902591177617],
      "ENT Engineering Technology Hall": [43.0850318764658, -77.68032773318922],
      "FHA Helen Fish Hall (A)": [0,0],
      "FHB Helen Fish Hall B": [0,0],
      "FHC Helen Fish Hall C": [0,0],
      "FMS Facilities Management Services": [0,0],
      "FNK 40 Franklin Street": [0,0],
      "GAN Frank E. Gannett Hall": [43.08527049805491, -77.67629104238274],
      "GHA Greek House A - Zeta Tau Alpha": [0,0],
      "GHB Greek House B - Delta Phi Epsilon": [0,0],
      "GHC Greek House C - Alpha Sigma Alpha": [0,0],
      "GHD Greek House D - Phi Kappa Psi": [0,0],
      "GHE Greek House E - Alpha Xi Delta": [0,0],
      "GHF Greek House F - Pi Kappa Phi": [0,0],
      "GLE James E. Gleason Hall": [43.08423270156981, -77.6779138669747],
      "GOB Gosnell Boathouse": [0,0],
      "GOL Golisano Hall": [43.08450625401825, -77.67992385934494],
      "GOR Gordon Field House & Activities Center": [43.085082087108894, -77.67226754316222],
      "GOS Thomas Gosnell Hall": [43.083661293930064, -77.6772606873489],
      "GVC Global Village Way C": [0,0],
      "GVD Global Village Way D": [0,0],
      "GVE Global Village Way E": [0,0],
      "GVP Global Village Plaza": [0,0],
      "GWH Grace Watson Hall": [43.08366074828328, -77.66912721850348],
      "HAC Hale-Andrews Student Life Center": [43.08455245869932, -77.67222248855687],
      "HLC Hugh L. Carey Hall": [43.08272602758297, -77.67885114501152],
      "ICC RIT Inn & Conference Center": [0,0],
      "INS Institute Hall": [43.08542499145876, -77.6791176728135],
      "JEF 175 Jefferson Road": [0,0],
      "KGH Kate Gleason Hall": [43.08435368710708, -77.66809233696328],
      "LAC Laboratory for Applied Computing": [0,0],
      "LBJ Lyndon Baines Johnson Hall": [43.08739963372037, -77.66835821661624],
      "LBR Liberal Arts Hall": [43.08442965799544, -77.67640699646026],
      "LEL Leenhouts Lodge at the Tait Preserve": [0,0],
      "LH Liberty Hill": [0,0],
      "LOB Joseph M. Lobozzo Alumni House": [0,0],
      "LOW Max Lowenthal Hall": [43.08297728935863, -77.67726424176936],
      "MEH Mark Ellingson Hall": [43.08627831786393, -77.66797130584808],
      "MON Monroe Hall": [43.0839988490521, -77.67516010847032],
      "MPT Music Performance Theater": [0,0],
      "MSS MAGIC Spell Studios": [43.085677740281525, -77.67635941153638],
      "OBS Observatory House": [0,0],
      "ORN Orange Hall": [43.08364669299646, -77.67882279549772],
      "PGA Perkins Green Apartments": [43.08580024957757, -77.66033842093185],
      "POL Gene Polisseni Center": [43.08269908992204, -77.67464244362714],
      "PPD 100 Park Point Drive": [0,0],
      "PTH Peter Peterson Hall": [43.08601041501198, -77.66855244166551],
      "RED Red Barn": [43.084373186017984, -77.68473958570127],
      "RHA Residence Hall A": [43.08423479373873, -77.66979005180497],
      "RHB Residence Hall B": [43.08465476322702, -77.6694394257646],
      "RHC Residence Hall C": [43.08517221242193, -77.66946288690295],
      "RHD Residence Hall D": [43.085831934990026, -77.66899803126843],
      "RIA Frank Ritter Ice Arena": [43.0852832885352, -77.67392231845965],
      "RKA Riverknoll Apartments": [0,0],
      "ROS Lewis P. Ross Hall": [43.082487202046394, -77.6779081223646],
      "RSC Rosica Hall": [43.08601663413455, -77.66942586272694],
      "SAN Sands Family Studios": [0,0],
      "SAU Student Alumni Union": [43.08400564674267, -77.67435277351996],
      "SHD Student Hall for Exploration and Development": [43.08398003795007, -77.67579961614729],
      "SHH Sol Heumann Hall": [43.085489941165434, -77.66715379660876],
      "SIH Student Innovation Hall": [43.0834220600785, -77.68018677858299],
      "SLA Louise Slaughter Hall": [43.08493457803417, -77.68220530079356],
      "SMT Schmitt Interfaith Center": [43.08405473580076, -77.6734886794579],
      "SUS Sustainability Institute Hall": [43.085372417437384, -77.68128119297896],
      "TPD 125 Tech Park Drive": [0,0],
      "UCS University Commons Suites": [0,0],
      "UNI University Gallery": [0,0],
      "USC University Services Center": [43.08336412896962, -77.68009369156634],
      "VIG Vignelli Center for Design Studies": [43.085294002269634, -77.6777412534232],
      "VRB Vehicle Repair Building": [0,0],
      "WAL Wallace Library": [43.083952905560295, -77.67635899714702],
      "WEL Welcome Center": [0,0],
    }

    const foods = ["Candy", "Snacks", "Pizza", "Desserts"]

    function addUpVote(i) {
      window.todos[i].upvotes += 1
      updateTodos()
    }

    function addDownVote(i) {
      window.todos[i].upvotes -= 1
      updateTodos()
    }

    window.todos = ${todos || []}

    console.log("Events/todos:", window.todos)

    // Begin map code

    const map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: 0
      })
    });

    function CenterMap(long, lat) {
      console.log("Long: " + long + " Lat: " + lat);
      map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
      map.getView().setZoom(15);
    }

    CenterMap(-77.6765, 43.0828) // center at RIT campus

    // var layer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         features: [
    //             new ol.Feature({
    //                 geometry: new ol.geom.Point(ol.proj.fromLonLat([-77.6765, 43.0828]))
    //             })
    //         ]
    //     })
    // });
    // map.addLayer(layer);

    // const popup = new ol.Overlay({
    //   element: document.getElementById('popup'),
    // });
    // map.addOverlay(popup);

    // const element = popup.getElement();
    // map.on('click', function (evt) {
    //   const coordinate = evt.coordinate;
    //   const hdms = ol.coordinate.toStringHDMS(ol.proj.fromLonLat(coordinate));
    //   popup.setPosition(coordinate);
    //   console.log(coordinate)
    // });

    const loadPins = () => {
      var features = []

      for(let i = 0; i < todos.length; i++){

        const pointCoord = coords[todos[i].location].reverse() // google cords are reversed
        //console.log(pointCoord)
        if(pointCoord[0] !== 0){
          const newFeature = new ol.Feature({
            geometry: new ol.geom.Point(pointCoord),
          });
          
          const newIcon = new ol.style.Style({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(pointCoord)),
            image: new ol.style.Icon({
              anchor: [0.5, 0.9], 
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: 'https://i.imgur.com/JB6ZaAe.png',
              scale: 0.3,
            }),
          });

          newFeature.setStyle(newIcon)
          features.push(newFeature)
        }
      }

      // console.log("Features", features)

      const icons = new ol.source.Vector({})
      icons.addFeatures(features)

      var vectorLayer = new ol.layer.Vector({
        renderBuffer: 100000000, // this seems to affect the icon vanishing when it's too small
        source: icons,
      });

      map.addLayer(vectorLayer)
    }

    loadPins()

    const geolocation = new ol.Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.displayProjection,
    });
    
    // handle geolocation error.
    geolocation.on('error', function (error) {
      console.log("Geolocation error", error)
    });
    
    const accuracyFeature = new ol.Feature();

    geolocation.on('change:accuracyGeometry', function () {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry().transform('EPSG:4326', 'EPSG:3857'));
    });
    
    const positionFeature = new ol.Feature();
    positionFeature.setStyle(
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC',
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      })
    );
    
    geolocation.on('change:position', function () {
      const coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates ? new ol.geom.Point(ol.proj.fromLonLat(coordinates)) : null);
    });

    var locationLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [positionFeature, accuracyFeature]
      }),
    })

    map.addLayer(locationLayer)

    const locate = document.createElement('div');
    locate.className = 'ol-control ol-unselectable locate';
    locate.innerHTML = '<button title="Home">◎</button>';
    // ◎🏠
    locate.addEventListener('click', function () {
      CenterMap(-77.6765, 43.0828)
    });
    map.addControl(
      new ol.control.Control({
        element: locate,
      })
    );

    // End map code

    var updateTodos = function() {
      fetch("/", { method: 'PUT', body: JSON.stringify({ todos: window.todos }) })
      populateTodos()
      startUpWithCurrent()
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

      for(let i = 0; i < inners.length; i++){
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
      for(let i = 0; i < buildings.length; i++){
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

    var eventNot = document.getElementById("eventLocation")
    eventNot.addEventListener('change', function() { checkNotListed(); }, false)

    var loginAccessors = document.getElementsByClassName("loginComponent")
    for(let i = 0; i < loginAccessors.length; i++){
      loginAccessors[i].addEventListener('click', function() { toggleLoginModal(); }, false)
    }

    var avatar = document.querySelector("#avatar")
    avatar.addEventListener('click', function() { toggleUserDropdown(); }, false)

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

    var eventOutside = document.getElementById("outsideLocation")
    eventOutside.addEventListener('change', function() { checkOutside(); }, false)

    var fillFoods = function(){
      var foodContainer = document.querySelector("#foodType")
      //console.log("food", foodContainer)
      foodContainer.innerHTML = null

      var title = document.createElement("div")
      title.innerText = "Food Types Available"
      title.setAttribute("Class", "ms-2 mb-5 text-sm font-medium text-gray-900 dark:text-gray-300")
      foodContainer.appendChild(title)
      
      for(let i = 0; i < foods.length; i++){
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

      var count = 0;

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

        var nameBlock = document.createElement("div")
        nameBlock.className = todo.completed ? "line-through" : ""
        nameBlock.classList.add("text-left")
        nameBlock.setAttribute("style",  "font-weight: 600;")
        nameBlock.id = todo.track
        nameBlock.innerText = todo.upvotes + " " + todo.name // + " (" + todo.track + ")" // uncomment to add the tracking number
        nameBlock.dataset.count = count
        nameBlock.dataset.votes = todo.upvotes
        nameBlock.dataset.track = todo.track
        nameBlock.className += " nameBlock"

        var upV = document.createElement("button")
        upV.name = "upV"
        upV.id = "u" + todo.track
        upV.dataset.count = count
        upV.type = "button"
        upV.className = "bg-white rounded-md p-2 inline-flex items-center justify-right text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"

        var upImg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        upImg.setAttribute("class", "h-2 w-2")
        upImg.setAttribute("fill",  "none")
        upImg.setAttribute("viewBox",  "0 0 24 24")
        upImg.setAttribute("stroke",  "currentColor")

        var strokeUp = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        strokeUp.setAttribute("stroke-linecap", "round")
        strokeUp.setAttribute("stroke-linejoin", "round")
        strokeUp.setAttribute("stroke-width",  "2")
        strokeUp.setAttribute("d", "M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75")

        upImg.appendChild(strokeUp)

        upV.appendChild(upImg)

        var downV = document.createElement("button")
        downV.type = "button"
        downV.id = "d" + todo.track
        downV.name = "downV"
        downV.dataset.count = count
        downV.className = "bg-white rounded-md p-2 inline-flex items-center justify-right text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"

        var downImg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        downImg.setAttribute("class", "h-2 w-2")
        downImg.setAttribute("fill",  "none")
        downImg.setAttribute("viewBox",  "0 0 24 24")
        downImg.setAttribute("stroke",  "currentColor")

        var strokeDown = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        strokeDown.setAttribute("stroke-linecap", "round")
        strokeDown.setAttribute("stroke-linejoin", "round")
        strokeDown.setAttribute("stroke-width",  "2")
        strokeDown.setAttribute("d", "M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75")

        downImg.appendChild(strokeDown)

        downV.appendChild(downImg)

        
        var xout = document.createElement("button")
        xout.type = "button"
        xout.value = count
        xout.onclick = function () {
          window.todos.splice(xout.value, 1) // remove the element
          updateTodos()
        }
        xout.className = "hidden bg-white rounded-md p-2 inline-flex items-center justify-right text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"

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

        //console.log("Time left", timeLeft + " " + todo.location)
        var hoursLeft = Math.floor(timeLeft / 3600000)
        timeLeft -= hoursLeft * 3600 * 1000
        var minsLeft = Math.floor(timeLeft / 60000)
        var timeContent = "Time left: " + (hoursLeft > 0 ? hoursLeft + " hours and " : "") + minsLeft + " minutes"

        text.innerHTML += newLine + timeContent

        var description = foodOptions.length > 0 ? "" : newLine + "No food type specified"
        if(foodOptions.length > 0){
          description += newLine + "Food types:"
          for(let i = 0; i < foodOptions.length; i++){
            description += newLine + "• " + foodOptions[i]
          } // This is how I have to do nextLine / newLine
        }

        text.innerText += description
        text.setAttribute("class", "border-t-2 border-blue-900 w-full text-left")
        inside.appendChild(text)

        var votes = document.createElement("div")
        votes.appendChild(upV)
        votes.appendChild(downV)

        //el.appendChild(checkbox)
        upper.appendChild(nameBlock)
        upper.appendChild(xout)
        upper.appendChild(votes)
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
      for(let i = 0; i < foods.length; i++){
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

      //console.log(isOutside)
      if (locationVal !== "Location" && locationVal !== null && event.value !== "Event Type" && event.value !== null) {
        console.log(event.value)
        console.log(locationVal)
        var description = event.value + " at " + locationVal
        var randTrack = Math.random() * 100000000000000000
        console.log(randTrack)
        window.todos = [].concat(todos, { track: randTrack, id: window.todos.length + 1, name: description, location: locationVal, room: roomNum.value, outside: isOutside.checked, foods: foodOptions, hours: timeUp, upvotes: 1, completed: false })
        event.value = "Event Type"
        location.value = "Location"
        roomNum.value = ""
        hours.value = ""
        isOutside.checked = false
        checkOutside()
        updateTodos()
        loadPins()
      }
    }

    document.querySelector("#create").addEventListener('click', createTodo)
  </script>
</html>`

const defaultData = { todos: [], track : 0 }

const setCache = (key, data) => EXAMPLE_DATA.put(key, data)
const getCache = key => EXAMPLE_DATA.get(key)
const setTracker = (key, data) => TRACKER.put("tracker", data)
const getTracker = i => TRACKER.get("tracker")
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
  //console.log("Bodyhere", body)
  return new Response(body, {
    headers: { 'Content-Type': 'text/html' }, 
  })
}

async function updateTodos(request) {
  const cacheKey = 1
  const body = await request.text()
  const ip = request.headers.get('CF-Connecting-IP')
  //const cacheKey = `data-${ip}`
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
  //console.log("Url", event.request.url)
  event.respondWith(handleRequest(event.request))
})