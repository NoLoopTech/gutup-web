// lib/firebaseImageUtils.ts
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject
} from "firebase/storage"
import { storage } from "@/lib/firebase" // adjust the path to your firebase config

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 */
export const uploadImageToFirebase = async (
  file: File,
  folder: string
): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

/**
 * Deletes a file from Firebase Storage by its download URL.
 */
export const deleteImageFromFirebase = async (
  downloadUrl: string
): Promise<void> => {
  const storageRef = ref(storage, downloadUrl)
  await deleteObject(storageRef)
}
