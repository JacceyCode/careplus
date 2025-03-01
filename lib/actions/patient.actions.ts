"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return newUser;
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([
        Query.or([
          Query.equal("email", [user.email]),
          Query.equal("phone", [user.phone]),
        ]),
      ]);

      if (
        documents.users[0].name.toLocaleLowerCase() !==
          user.name.toLocaleLowerCase() ||
        documents.users[0].email !== user.email ||
        documents.users[0].phone !== user.phone
      ) {
        throw error;
      }
      return documents?.users[0];
    }

    throw error;
  }
};

export const loginUser = async (userEmail: string) => {
  try {
    const user = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("email", userEmail)]
    );

    if (user.documents.length === 0)
      throw new Error("User not found. Please signup for a user account.");

    return parseStringify(user.documents[0]);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "User not found. Please signup for a user account."
      )
    ) {
      const documents = await users.list([Query.equal("email", userEmail)]);

      if (documents.users.length === 0) {
        throw new Error("User not found. Please signup for a user account.");
      }

      return parseStringify(documents?.users[0]);
    }

    console.error("Unexpected error during login:", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(error);
  }
};
