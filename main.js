import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import  { getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider,
  TwitterAuthProvider, signInWithPopup, signOut  } from 
  "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";//Auth
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc,
  deleteDoc, doc, getDoc, updateDoc, where } from
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
      const getAdmin = () => query(collection(db,"Users"),where("Nombre","==","Admin"));
      const q = getAdmin()
      const unsubscribe = onSnapshot(q,(querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
          if (user.providerData[0].email == doc.data().Correo){
            window.location.href = "mainPageAdmin.html"
            // console.log("ADMIN")
          }else{
            window.location.href = "mainPage.html"
            // console.log("ADMIN't")
          }
        })
      })
      
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

  const prodForm = document.getElementById('add-product-form')
  const uptProdForm = document.getElementById('edit-producto-form')
  const promoForm = document.getElementById('add-promo-form')
  const uptPromoForm = document.getElementById('edit-promo-form')
  // const modal = new mdb.Modal(edit-producto)



  const getProductos = () => query(collection(db,'Productos'),orderBy("Nombre"))
  const getPromociones = () => query(collection(db,'Promociones'),orderBy("Nombre"))
  const getUsuarios = () => query(collection(db,'Users'),orderBy("Nombre"))

  //agregar
  const newProduct = (Nombre, foto, Descripción, Precio) => {
    addDoc(collection(db,'Productos'), {Nombre, foto, Descripción, Precio})
  }
  const newPromo = (Nombre, foto, Descripción, Precio) => {
    addDoc(collection(db,'Promociones'), {Nombre, foto, Descripción, Precio})
  }
  const newUser = (Nombre, Correo, Domicilio, Telefono) => {
    addDoc(collection(db,'Usuarios'), {Nombre, Correo, Domicilio, Telefono})
  }
  
  //borrar
  const deleteProd = (id) => {
    deleteDoc(doc(db,'Productos', id))
  }
  const deletePromo = (id) => {
    deleteDoc(doc(db,'Promociones', id))
  }
  
  //actualizar
  const updateProd = (id, nnombre, nfoto, ndescripcion, nprecio) => {
    updateDoc(doc(db,'Productos', id), {Nombre:nnombre, foto:nfoto, Descripción:ndescripcion, Precio:nprecio})
  }
  const updateProd2 = (id, nnombre, ndescripcion, nprecio) => {
    updateDoc(doc(db,'Productos', id), {Nombre:nnombre,  Descripción:ndescripcion, Precio:nprecio})
  }
  const updatePromo = (id, nnombre, nfoto, ndescripcion, nprecio) => {
    updateDoc(doc(db,'Promociones', id), {Nombre:nnombre, foto:nfoto, Descripción:ndescripcion, Precio:nprecio})
  }
  const updatePromo2 = (id, nnombre, ndescripcion, nprecio) => {
    updateDoc(doc(db,'Promociones', id), {Nombre:nnombre, Descripción:ndescripcion, Precio:nprecio})
  }
  const updateUser = (id, nnombre, ncorreo, ndomicilio, ntelefono) => {
    updateDoc(doc(db,'Usuarios', id), {Nombre:nnombre, Correo:ncorreo, Domicilio:ndomicilio, Telefono:ntelefono})
  }
  
  //ID
  const idProd= (id) => getDoc(doc(db,"Productos",id));
  const idPromo= (id) => getDoc(doc(db,"Promociones",id));
  const idUser= (id) => getDoc(doc(db,"Usuarios",id));

  let updt = false;
  let id = '';

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
            <div class="d-grid gap-2 col-1">
                <button class="btn btn-outline-warning btn-dark btn-rounded text-warning btn-update" data-id="${producto.ID}"
                data-mdb-toggle="modal" data-mdb-target="#edit-producto">Editar</button>
                <button class="btn btn-outline-danger btn-dark btn-rounded text-danger btn-delete" data-id="${producto.ID}"
                data-mdb-toggle="modal" data-mdb-target="#delete-pro">Eliminar</button>
            </div>
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

      const lbdel = document.querySelectorAll('.btn-delete')
      lbdel.forEach(btn => {
        btn.addEventListener('click', async (e)=> {
            let texto = "Borrar producto?"
            if(confirm(texto)==true){
                await deleteProd(e.target.dataset.id)
            }
    })
      })

      const lbupd = document.querySelectorAll('.btn-update')
      lbupd.forEach(btn => {
        btn.addEventListener('click', async (e)=> {
            updt=true;
            const doc = await idProd(e.target.dataset.id)
            id = doc.id
            const producto = doc.data()
            uptProdForm['edit-name-prod'].value = producto.Nombre
            uptProdForm['edit-desc-prod'].value = producto.Descripción
            uptProdForm['edit-precio-prod'].value = producto.Precio            
            uptProdForm.addEventListener('submit', (e) =>{
              e.preventDefault();
              let foto = (ref(storage,producto.foto))
              console.log(foto)
              const nombre = document.querySelector('#edit-name-prod').value;
              const descripcion = document.querySelector('#edit-desc-prod').value;
              const precio = document.querySelector('#edit-precio-prod').value;
              if(document.querySelector('#edit-img-prod').value != ''){
                const foto = document.querySelector('#edit-img-prod').value;
                updateProd(id, nombre, foto, descripcion, precio)
              }
              else{
                updateProd2(id, nombre, descripcion, precio)
              }
              console.log('Informacion actualizada con exito')
              //modal.hide()
            })
        })     
    })

    })
    //TABLA PROMOCIONES
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
            <div class="d-grid gap-3 col-3">
                <button class="btn btn-outline-warning btn-dark btn-rounded text-warning"
                data-mdb-toggle="modal" data-mdb-target="#edit-promo">Editar</button>
                <button class="btn btn-outline-danger btn-dark btn-rounded text-danger"
                data-mdb-toggle="modal" data-mdb-target="#delete-pro">Eliminar</button>
            </div>
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

    //TABLA USUARIOS
    let q3 = await getUsuarios()
    var unsubscribe = onSnapshot(q3, (querySnapshot) =>{
      let userContainer = document.getElementById('tablausuarios-body')
      let html = ''
      const usuarios = []
      querySnapshot.forEach((doc)=>{
        const usuario = doc.data()
        usuario.ID = doc.id
        usuarios.push(usuario.Nombre)
        html +=`
        <tr>
        <td>
          <p class="text-warning" style="margin-left:5rem;">${usuario.Nombre}</p>
        </td>
        <td class="text-warning">
          <p>${usuario.Correo}</p>
        </td>
        <td class="text-warning">${usuario.Domicilio}</td>
        <td class="text-warning">${usuario.Teléfono}</td>
        <td>
            <div class="d-grid gap-3 col-3">
                <button class="btn btn-outline-warning btn-dark btn-rounded text-warning"
                data-mdb-toggle="modal" data-mdb-target="#edit-promo">Editar</button>
                <button class="btn btn-outline-danger btn-dark btn-rounded text-danger"
                data-mdb-toggle="modal" data-mdb-target="#delete-pro">Eliminar</button>
            </div>
        </td>
      </tr>
        `
      })
      userContainer.innerHTML = html
     
    })
  })
}

//PERFIL
if (page.pathname == '/html/perfil.html'){
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
}
