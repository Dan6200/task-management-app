//cspell:ignore firestore
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Firestore,
  CollectionReference,
  DocumentData,
  Query,
  DocumentReference,
} from "firebase/firestore";

export const collectionWrapper = (
  firestore: Firestore,
  path: string,
  ...pathSegments: string[]
) => {
  let ref = null,
    error = null;
  try {
    ref = collection(firestore, path, ...pathSegments);
  } catch (err) {
    error = "error getting collection reference: " + err;
  }
  return { error, ref };
};

export const addDocWrapper = async (
  reference: CollectionReference<any, DocumentData>,
  data: any
) => {
  let error = null,
    result = null;
  try {
    result = await addDoc(reference, data);
  } catch (err) {
    error = "error adding document: " + err;
  }
  return { error, result };
};

export const getDocsWrapper = async (query: Query<unknown, DocumentData>) => {
  let error = null,
    result = null;
  try {
    result = await getDocs(query);
  } catch (err) {
    error = "error retrieving all documents: " + err;
  }
  return { error, result };
};

export function docWrapper(
  firestore: Firestore,
  path: string,
  ...pathSegments: string[]
): {
  error: string | null;
  ref: any | null;
} {
  let ref = null,
    error = null;
  try {
    ref = doc(firestore, path, ...pathSegments);
  } catch (err) {
    error = "error getting document reference: " + err;
  }
  return { error, ref };
}

export const updateDocWrapper = async (
  reference: DocumentReference<unknown, any>,
  data: any
) => {
  let error = null;
  try {
    await updateDoc(reference, data);
  } catch (err) {
    error = "error updating document: " + err;
  }
  return { error };
};

export const deleteDocWrapper = async (
  reference: DocumentReference<unknown, DocumentData>
) => {
  let error = null,
    result = null;
  try {
    result = await deleteDoc(reference);
  } catch (err) {
    error = "error deleting document: " + err;
  }
  return { error, result };
};
