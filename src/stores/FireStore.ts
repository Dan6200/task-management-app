import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const collectionWrapper = (...args: [any, any, any, any]) => {
  let ref = null,
    error = null;
  try {
    ref = collection(...args);
  } catch (err) {
    error = "error getting collection reference: " + err;
  }
  return { error, ref };
};

export const addDocWrapper = async (...args: [any, any]) => {
  let error = null,
    result = null;
  try {
    result = await addDoc(...args);
  } catch (err) {
    error = "error adding document: " + err;
  }
  return { error, result };
};

export const getDocsWrapper = async (arg: any) => {
  let error = null,
    result = null;
  try {
    result = await getDocs(arg);
  } catch (err) {
    error = "error retrieving all documents: " + err;
  }
  return { error, result };
};

export const docWrapper = (...args: [any, any, any, any, any]) => {
  let ref = null,
    error = null;
  try {
    ref = doc(...args);
  } catch (err) {
    error = "error getting document reference: " + err;
  }
  return { error, ref };
};

export const updateDocWrapper = async (...args: [any, any]) => {
  let error = null;
  try {
    await updateDoc(...args);
  } catch (err) {
    error = "error updating document: " + err;
  }
  return { error };
};

export const deleteDocWrapper = async (arg: any) => {
  let error = null,
    result = null;
  try {
    result = await deleteDoc(arg);
  } catch (err) {
    error = "error deleting document: " + err;
  }
  return { error, result };
};
