// lib/firebaseImageUtils.ts
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject
} from "firebase/storage"
import { storage } from "@/lib/firebase"

// Uploads a file to Firebase Storage and returns the download URL.
// firebaseImageUtils.ts
export const uploadImageToFirebase = async (
  file: File | Blob | string,
  folder: string,
  fileName: string
): Promise<string> => {
  if (typeof file === "string") {
    // Already uploaded
    return file
  }

  const storageRef = ref(storage, `${folder}/${fileName}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

// Deletes a file from Firebase Storage by its download URL.
export const deleteImageFromFirebase = async (
  downloadUrl: string
): Promise<void> => {
  try {
    const decodedUrl = decodeURIComponent(downloadUrl.split("?")[0])
    const pathMatch = decodedUrl.match(/\/o\/(.+)$/)
    const filePath = pathMatch ? pathMatch[1].replace(/%2F/g, "/") : null

    if (!filePath) throw new Error("Invalid Firebase Storage URL format")

    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Failed to delete image from Firebase:", error)
  }
}
