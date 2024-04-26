"server-only";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const collectionWrapper = (...args: [any, any, any, any]) =>
  collection(...args);
export const addDocWrapper = async (...args: [any, any]) => {
  try {
    const result = await addDoc(...args);
    return result;
  } catch (err) {
    console.error(err);
  }
};
export const getDocsWrapper = async (arg: any) => {
  try {
    const res = await getDocs(arg);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const docWrapper = (...args: [any, any, any, any, any]) => doc(...args);
export const updateDocWrapper = async (...args: [any, any]) => {
  try {
    await updateDoc(...args);
  } catch (err) {
    console.error(err);
  }
};
export const deleteDocWrapper = async (arg: any) => {
  try {
    await deleteDoc(arg);
  } catch (err) {
    console.error(err);
  }
};
