signInWithEmailAndPassword(auth, "jwittespare@gmail.com", "newPassword")
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("User signed in " + user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

        createUserWithEmailAndPassword(auth, "jwittespare@gmail.com", "newPassword")
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User is: " + user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage)
          // ..
        });