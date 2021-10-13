// ###################################################################################################
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


import React, { useRef, useState } from 'react';



firebase.initializeApp({
  // prefered database but wont accept data
  // apiKey: "AIzaSyDRs7_azKlBqlq9SVfO-TfPSYxyqcCi5is",
  // authDomain: "a-agilescrum.firebaseapp.com",
  // projectId: "a-agilescrum",
  // storageBucket: "a-agilescrum.appspot.com",
  // messagingSenderId: "844567482368",
  // appId: "1:844567482368:web:cd0dc238b4b0c8dffc08e5",
  // measurementId: "G-300199LHV2"

  // Using superChatDemo // this one works and the other doesnt for unknown reason
  apiKey: "AIzaSyBVtzPN4scCnsRdqc8fG88ZiV-v-ipkwHs",
  authDomain: "superchatdemo-53429.firebaseapp.com",
  projectId: "superchatdemo-53429",
  storageBucket: "superchatdemo-53429.appspot.com",
  messagingSenderId: "786660954800",
  appId: "1:786660954800:web:7d8e6bc0eea6374d8aa175",
  measurementId: "G-R51Z09WJ2L"

})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();



// ###################################################################################################
export function StupidAdd(props) {
  const add =  async () => { 
    const messagesRef = firestore.collection('messages');
    await messagesRef.add({
      projectName: "testing Project",
    });

  };
  return (
    <button onClick={add}>Stupid Add UID {props.user ? auth.currentUser.uid : "No User"}</button>
  )
}
// ###################################################################################################

export function ProjectsPage(props) {
  const dummy = useRef();
  const projectsRef = firestore.collection('projects');
  const query = projectsRef.where("uid", "==", auth.currentUser.uid)
                          //  .orderBy('createdAt', "asc")
  // const query = projectsRef.where("uid", "==", auth.currentUser.uid);
  // query.orderBy("createdAt");
  // const query = projectsRef.orderBy("createdAt");

  const [projects, stillLoading, error] = useCollectionData(query, { idField: 'id' });
  // const sortProjects
  console.log("If Error " + error)

  const [formValue, setFormValue] = useState('');


  // const sendMessage = async (e) => {
  const enterProjectName = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await projectsRef.add({
      projectName: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('');
  }

  return (<>
    <main>
      {projects && projects.map(at => <ProjectForm key={at.id} projects={at} />)} {/*// at == atributes*/}
    </main>

    <form onSubmit={enterProjectName}>
      {/* {stillLoading ? "Still Loading Query" : "error " + {Object.keys(error)}} */}
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Entry New Project Name" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)

}

// ###################################################################################################
function ProjectForm(props) {
    const { projectName } = props.projects;
  
    return (<>
      <div>
        <p>{projectName}</p>
      </div>
    </>)
}

export {firebase, useAuthState, useCollectionData};