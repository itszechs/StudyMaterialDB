import express, { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database";

export const courseRouter = Router();
courseRouter.use(express.json());

courseRouter.get("/", async (_?: Request, res?: Response) => {
    try {
        const courses = await collections.course.find({}).toArray();
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

courseRouter.get("/:id", async (req?: Request, res?: Response) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const course = await collections.course.findOne(query);

        if (course) {
            res.status(200).send(course);
        } else {
            res.status(404).send(`Failed to find an course: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find an course: ID ${req?.params?.id}`);
    }
});

courseRouter.post("/", async (req?: Request, res?: Response) => {
    try {
        const employee = req.body;
        const result = await collections.course?.insertOne(employee);

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new employee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});