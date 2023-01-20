export interface Course {
   course_code: string;
   course_name: string;
   files: File[];
   _id?: string;
}

export interface File {
   name: string;
   size: number;
}