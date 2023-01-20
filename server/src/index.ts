import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database";
import { courseRouter } from "./routes/courses";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());

        // start the Express server
        app.listen(5500, () => {
            console.log(`Server running at http://localhost:5500`);
        });

        app.use("/courses", courseRouter);

    })
    .catch(error => console.error(error));

