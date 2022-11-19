import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import  { getAuth, signOut  } from  "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { getFirestore, collection, query, onSnapshot} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js"//Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAsgrQ5iaiMeU196UR0afVVGvsfSElBuk",
    authDomain: "nosql-test-f45f2.firebaseapp.com",
    projectId: "nosql-test-f45f2",
    storageBucket: "nosql-test-f45f2.appspot.com",
    messagingSenderId: "874177783462",
    appId: "1:874177783462:web:74e4b4820fcdf154c67667"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app)
const db = getFirestore();
const auth = getAuth();
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

const getTask1 = () => query(collection(db,'Doctores'));
const getTask2 = () => query(collection(db,'Pacientes'));

window.addEventListener('DOMContentLoaded',async () =>{
    const q1 = await getTask1()
    const q2 = await getTask2()
    var unsubscribe = onSnapshot(q1,(querySnapshot)=>{
        let taskContainer = document.getElementById('tabla1-body')
        let html = ''
        const doctors = [];
        querySnapshot.forEach((doc)=>{
            let doctor = doc.data()
            doctor.ID = doc.id
            doctors.push(doctor.Nombre)
            html +=`
            <tr>
            <td>
              <div class="d-flex align-items-center">
                <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style="width: 45px; height: 45px"
                    class="rounded-circle"
                    />
                <div class="ms-3">
                  <p class="fw-bold mb-1">${doctor.Nombre}</p>
                </div>
              </div>
            </td>
            <td>
              <p class="fw-bold mb-1">${doctor.Especialidad}</p>
            </td>
            <td>
              <span class="badge badge-success rounded-pill d-inline">${doctor.Sexo}</span>
            </td>
            <td>${doctor.Numero_Contacto}</td>        
          </tr>`;
        });
        taskContainer.innerHTML = html
    })
    
    var unsubscribe = onSnapshot(q2,(querySnapshot)=>{
        let taskContainer = document.getElementById('tabla2-body')
        let html = ''
        const patients = [];
        querySnapshot.forEach((doc)=>{
            const patient = doc.data()
            patient.ID = doc.id
            patients.push(patient.Nombre)
            html +=`
            <tr>
            <td>
              <div class="d-flex align-items-center">
                <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style="width: 45px; height: 45px"
                    class="rounded-circle"
                    />
                <div class="ms-3">
                  <p class="fw-bold mb-1">${patient.Nombre}</p>
                </div>
              </div>
            </td>
            <td>
              <p class="fw-bold mb-1">${patient.Edad}</p>
              <p class="text-muted mb-0">${patient.Enfermedad}</p>
            </td>
            <td>
              <span class="badge badge-success rounded-pill d-inline">${patient.Sexo}</span>
            </td>
            <td>98765432</td>        
          </tr>`;
        });
        taskContainer.innerHTML = html
    })
})