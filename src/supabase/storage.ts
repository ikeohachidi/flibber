import supabase from "./supabase";
import { STORAGE_BUCKET } from "utils/envs";

type StorageCreationResponse = {
	data: string | null
	error: Error | null
}

type UploadFile = 
	| ArrayBuffer
	| ArrayBufferView
	| Blob
	| Buffer
	| File
	| FormData
	| NodeJS.ReadableStream
	| ReadableStream<Uint8Array>
	| URLSearchParams
	| string

export const uploadFile = async (param: { file: UploadFile, path: string | number }): Promise<{ Key: string } | null> => {
	const { data, error } = await supabase.storage.from(`${STORAGE_BUCKET}/${param.path}`).upload((param.file as File).name, param.file)
	if (error) {
		Promise.reject(error)
	}

	return data;
}

export const deleteFile = async (param: { fileName: string, path: string | number }): Promise<unknown> => {
	const { data, error } = await supabase.storage.from(STORAGE_BUCKET as string).remove([`${param.path}/${param.fileName}`])
	if (error) {
		Promise.reject(error)
	}

	return data;
}

export const getFileUrl = (param: { fileName: string, path: string | number }) => {
	const { publicURL, error } = supabase.storage.from(STORAGE_BUCKET as string).getPublicUrl(`${param.path}/${param.fileName}`)

	if (error) {
		Promise.reject(error)
	}

	return publicURL;
}