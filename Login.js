import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import  { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup  } from  "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsgrQ5iaiMeU196UR0afVVGvsfSElBuk",
  authDomain: "nosql-test-f45f2.firebaseapp.com",
  projectId: "nosql-test-f45f2",
  storageBucket: "nosql-test-f45f2.appspot.com",
  messagingSenderId: "874177783462",
  appId: "1:874177783462:web:35b9b65490c339dac67667"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const logInForm = document.querySelector('#login-form')
const signupForm = document.querySelector('#signupform')
const signupModal = document.getElementById('signupModal')
const googleLogin = document.querySelector('#google_login')
const FBLogin = document.querySelector('#facebook_login')
const twitterlogin = document.querySelector('#twitter_login')
const modal = new mdb.Modal(signupModal)

logInForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#email-input').value
    const pass = document.querySelector('#pass-input').value
    signInWithEmailAndPassword(auth, email, pass)
    .then(userCredential =>{
      logInForm.reset();
      window.location.href = "mainPage.html"
      console.log("Sesion Iniciada")
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.Message;
    })
  })
  
signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.querySelector('#signup-email').value;
    const pass = document.querySelector('#signup-pass').value;
    createUserWithEmailAndPassword(auth, email, pass)
    .then(userCredential=>{
      signupForm.reset()
      modal.hide()
      console.log('Registrado')
    })
    .catch((error)=>{
      const errorCode = error.code
      const errorMessage = error.message
    })
})

googleLogin.addEventListener('click',(e) =>{
  e.preventDefault()
  // const provider = new GoogleAuthProvider()
  const provider = new GoogleAuthProvider()
  console.log(provider)
  signInWithPopup(auth, provider)
  .then(result =>{
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    window.location.href = "mainPage.html"
  })
  .catch((error) => {
    console.error(error)
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);
  })
})

twitterlogin.addEventListener('click',e=>{
  e.preventDefault()
  const provider = new TwitterAuthProvider()
  signInWithPopup(auth, provider)
  .then((result)=>{
    const credential = TwitterAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const secret = credential.secret;
    const user = credential.user;
    console.log(token)
    console.log(secret)
    console.log(user)
  })
  .catch((error)=>{
    const errorCode = error.code
    const errorMessage = error.message
    const email = error.customData.email
    const credential = TwitterAuthProvider.credentialFromError(error)
    console.log('Error de Signup')
  })
})

FBLogin.addEventListener('click', e =>{
  e.preventDefault();
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
  .then((result)=>{
    const user = result.user
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    console.log('Inicio de Sesión con Facebook')
    window.location.href = "mainPage.html"
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = FacebookAuthProvider.credentialFromError(error);
  });
})
