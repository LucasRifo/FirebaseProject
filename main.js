import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import  { getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider,
  TwitterAuthProvider, signInWithPopup, signOut  } from 
  "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";//Auth
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc,
  deleteDoc, doc, getDoc, updateDoc } from
  "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js"//Firestore
import { getStorage, ref, getDownloadURL } from 
  "https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js";//Storage

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
const db = getFirestore()
const storage = getStorage();
const auth = getAuth();
const user = auth.currentUser
const page = window.location;

//CARRO DE COMPRAS
if (page.pathname == '/html/carritocompras.html'){

}

//ESTADO DEL PEDIDO
if (page.pathname == '/html/EstadoPedido.html'){

}

//LOGIN
if (page.pathname == '/html/index.html'){
  const logInForm = document.querySelector('#login-form')
  const signupForm = document.querySelector('#signupform')
  const signupModal = document.getElementById('signupModal')
  const googleLogin = document.querySelector('#google_login')
  const FBLogin = document.querySelector('#facebook_login')
  const modal = new mdb.Modal(signupModal)

  onAuthStateChanged(auth, (user) =>{
    if (user) {
      if (user.providerData[0].email == "lucasrifopena@gmail.com"){
        window.location.href = "mainPageAdmin.html"
      }else{
        window.location.href = "mainPage.html"
      }
    } 
    else {
      console.log("user esta en null")
    }
  })

  logInForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const email = document.querySelector('#email-input').value
      const pass = document.querySelector('#pass-input').value
      signInWithEmailAndPassword(auth, email, pass)
      .then(userCredential =>{
        logInForm.reset();
        // window.location.href = "mainPage.html"
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
    signInWithPopup(auth, provider)
    .then(result =>{
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      // window.location.href = "mainPage.html"
    })
    .catch((error) => {
      console.error(error)
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
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
      // window.location.href = "mainPage.html"
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = FacebookAuthProvider.credentialFromError(error);
    });
  })
}

//MAINPAGE
if (page.pathname == '/html/mainPage.html'){
  onAuthStateChanged(auth, (user) =>{
    if (user) {
      console.log(user.providerData[0].providerId)
      if (user.providerData[0].providerId == 'google.com'){
        console.log('logeado con google')
      }
    } 
    else {
      console.log("user esta en null")
      window.location.href = '/html/index.html'
    }
  })
  
  const logout = document.querySelector('#logout')
  logout.addEventListener('click',(e)=>{
    e.preventDefault()
    signOut(auth)
    .then(()=>{
      console.log('Cerrando sesion')
      window.location.href = 'index.html'
    })
    .catch((error)=>{
      const errorCode = error.code
      const errorMessage = error.message
    })
  })

  const getProductos = () => query(collection(db,'Productos'),orderBy("Nombre"))
  const getPromociones = () => query(collection(db,'Promociones'),orderBy("Nombre"))

  window.addEventListener('DOMContentLoaded',async () =>{
    //TABLA PRODUCTOS
    let q1 = await getProductos()
    var unsubscribe = onSnapshot(q1, (querySnapshot) =>{
      let productContainer = document.getElementById('tablaproductos-body')
      let html = ''
      const productos = []
      querySnapshot.forEach((doc)=>{
        const producto = doc.data()
        producto.ID = doc.id
        productos.push(producto.Nombre)
        html +=`
          <tr>
            <td>
              <p class="text-warning" style="margin-left:5rem;">${producto.Nombre}</p>
              <img
              class="product-image
              id = productpic"
              data-pic = ${producto.foto}>
            </td>
            <td class="text-warning">${producto.Descripción}</td>
            <td class="text-warning">\$${producto.Precio}</td>
            <td>
              <button class="btn btn-outline-warning btn-dark btn-rounded text-warning">Agregar al Carro</button>
            </td>
          </tr>
        `
      })
      productContainer.innerHTML = html
      const productpics = document.querySelectorAll('.productpic')
      productpics.forEach(img => {
        const imagen = ref(storage,img.dataset.pic)
        getDownloadURL(imagen)
        .then((url) => {
          img.setAttribute('src',url)
        })
      })
    })
    let q2 = await getPromociones()
    var unsubscribe = onSnapshot(q2, (querySnapshot) =>{
      let promoContainer = document.getElementById('tablapromociones-body')
      let html = ''
      const promociones = []
      querySnapshot.forEach((doc)=>{
        const promocion = doc.data()
        promocion.ID = doc.id
        promociones.push(promocion.Nombre)
        html +=`
          <tr>
            <td>
              <p class="text-warning" style="margin-left:5rem;">${promocion.Nombre}</p>
              <img
              class="product-image
              id = promopic"
              data-pic="${promocion.foto}">
            </td>
            <td class="text-warning">
              <p>${promocion.Agregados}</p>
            </td>
            <td class="text-warning">\$${promocion.Precio}</td>
            <td>
              <button class="btn btn-outline-warning btn-dark btn-rounded text-warning">Agregar al Carro</button>
            </td>
          </tr>
        `
      })
      promoContainer.innerHTML = html
      const promopics = document.querySelectorAll('.promopic')
      promopics.forEach(img => {
        const imagen = ref(storage,img.dataset.pic)
        getDownloadURL(imagen)
        .then((url) => {
          img.setAttribute('src',url)
        })
      })
    })
  })

}

//MAINPAGE ADMIN
if (page.pathname == '/html/mainPageAdmin.html'){
  onAuthStateChanged(auth, (user) =>{
    if (user) {
      console.log(user.providerData[0].providerId)
      if (user.providerData[0].providerId == 'google.com'){
        console.log('logeado con google')
      }
    } 
    else {
      console.log("user esta en null")
      window.location.href = '/html/index.html'
    }
  })
  
  const logout = document.querySelector('#logout')
  logout.addEventListener('click',(e)=>{
    e.preventDefault()
    signOut(auth)
    .then(()=>{
      console.log('Cerrando sesion')
      window.location.href = 'index.html'
    })
    .catch((error)=>{
      const errorCode = error.code
      const errorMessage = error.message
    })
  })

  const getProductos = () => query(collection(db,'Productos'),orderBy("Nombre"))
  const getPromociones = () => query(collection(db,'Promociones'),orderBy("Nombre"))

  window.addEventListener('DOMContentLoaded',async () =>{
    //TABLA PRODUCTOS
    let q1 = await getProductos()
    var unsubscribe = onSnapshot(q1, (querySnapshot) =>{
      let productContainer = document.getElementById('tablaproductos-body')
      let html = ''
      const productos = []
      querySnapshot.forEach((doc)=>{
        const producto = doc.data()
        producto.ID = doc.id
        productos.push(producto.Nombre)
        html +=`
          <tr>
            <td>
              <p class="text-warning" style="margin-left:5rem;">${producto.Nombre}</p>
              <img
              class="product-image
              id = productpic"
              data-pic = ${producto.foto}>
            </td>
            <td class="text-warning">${producto.Descripción}</td>
            <td class="text-warning">\$${producto.Precio}</td>
            <td>
              <button class="btn btn-outline-warning btn-dark btn-rounded text-warning">Agregar al Carro</button>
            </td>
          </tr>
        `
      })
      productContainer.innerHTML = html
      const productpics = document.querySelectorAll('.productpic')
      productpics.forEach(img => {
        const imagen = ref(storage,img.dataset.pic)
        getDownloadURL(imagen)
        .then((url) => {
          img.setAttribute('src',url)
        })
      })
    })
    let q2 = await getPromociones()
    var unsubscribe = onSnapshot(q2, (querySnapshot) =>{
      let promoContainer = document.getElementById('tablapromociones-body')
      let html = ''
      const promociones = []
      querySnapshot.forEach((doc)=>{
        const promocion = doc.data()
        promocion.ID = doc.id
        promociones.push(promocion.Nombre)
        html +=`
          <tr>
            <td>
              <p class="text-warning" style="margin-left:5rem;">${promocion.Nombre}</p>
              <img
              class="product-image
              id = promopic"
              data-pic="${promocion.foto}">
            </td>
            <td class="text-warning">
              <p>${promocion.Agregados}</p>
            </td>
            <td class="text-warning">\$${promocion.Precio}</td>
            <td>
              <button class="btn btn-outline-warning btn-dark btn-rounded text-warning">Agregar al Carro</button>
            </td>
          </tr>
        `
      })
      promoContainer.innerHTML = html
      const promopics = document.querySelectorAll('.promopic')
      promopics.forEach(img => {
        const imagen = ref(storage,img.dataset.pic)
        getDownloadURL(imagen)
        .then((url) => {
          img.setAttribute('src',url)
        })
      })
    })
  })
}

//PERFIL
if (page.pathname == '/html/perfil.html'){

}
