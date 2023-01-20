import { MongoClient, Collection, MongoServerError, Db } from "mongodb";
import { Course } from "../models/course";

export const collections: {
    course?: Collection<Course>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("StudyMaterialDB");
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Course>("courses");
    collections.course = employeesCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["course_code", "course_name", "files"],
            additionalProperties: false,
            properties: {
                _id: {},
                course_code: {
                    bsonType: "string",
                    description: "'courseCode' is required and is a string",
                },
                course_name: {
                    bsonType: "string",
                    description: "'courseName' is required and is a string",
                },
                files: {
                    bsonType: "array",
                    description: "'files' is required and is an array",
                }
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "courses",
        validator: jsonSchema
    }).catch(async (error: MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("courses", { validator: jsonSchema });
        }
    });
}