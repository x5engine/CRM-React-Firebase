import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDfUSCMtEgltDJW3-EU7XOWrCffgV6-XLs",
  authDomain: "x5engine-1fe8e.firebaseapp.com",
  projectId: "x5engine-1fe8e",
  storageBucket: "x5engine-1fe8e.appspot.com",
  messagingSenderId: "1020668400488",
  appId: "1:1020668400488:web:955d3f7166703a93037cdd",
  measurementId: "G-39LXZ6NWHW"
};

export const createDocument = async (document, type) => {
  if(!document) return;

  let contactRef = null;

  try {
    contactRef = await firestore.collection(type).add({
      ...document
    });
  } catch (error) {
    console.error(`error adding contact ${type}`, error)
  }

  return contactRef;
}

export const getDocuments = async (documentId=null, type, orderBy=null, whereFrom=null, whereTo=null) => {
  let snapShot = null;
  let docRef = null;

  try {
    docRef = await firestore.collection(type);

    if (documentId)
      docRef = await docRef.doc(documentId);

    if (orderBy)
      docRef = await docRef.orderBy(orderBy);

    if (whereFrom)
      docRef = await docRef.where(whereFrom.field, whereFrom.operator, whereFrom.condition);

    if (whereTo)
      docRef = await docRef.where(whereTo.field, whereTo.operator, whereTo.condition);

    console.log(docRef);
    snapShot = await docRef.get();
  } catch (error) {
    console.error(`error retrieving ${type} `, error);
  }
  
  return snapShot;
}

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if(!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if(!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user ', error);
    }
  }

  return userRef;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
