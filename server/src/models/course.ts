import { ObjectId } from "mongodb";

export interface Course {
   course_code: string;
   course_name: string;
   files: File[];
   _id?: ObjectId;
}

export interface File {
   name: string;
   size: number;
}