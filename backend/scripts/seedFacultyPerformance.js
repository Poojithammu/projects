// scripts/seedFacultyPerformance.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // Adjust path as needed
import FacultyPerformance from "../models/FacultyPerformance.js"; // Adjust path as needed

dotenv.config();

const sampleResearchPapers = (count) => {
    const papers = [];
    for (let i = 0; i < count; i++) {
        papers.push({
            title: `Research Paper ${i + 1}`,
            year: 2020 + Math.floor(Math.random() * 5),
        });
    }
    return papers;
};

const generateSamplePerformance = () => {
    const paperCount = Math.floor(Math.random() * 4) + 1;
    const feedbackCount = Math.floor(Math.random() * 5) + 3;
    const feedbackScores = Array.from({ length: feedbackCount }, () =>
        Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0 to 5.0
    );

    return {
        classesHandled: Math.floor(Math.random() * 10) + 1,
        feedbackScores,
        researchPapers: sampleResearchPapers(paperCount),
        attendanceRate: Math.floor(Math.random() * 21) + 80, // 80 to 100
    };
};

const seedFacultyPerformance = async () => {



    try {
        await mongoose.connect("mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await FacultyPerformance.deleteMany({});
        console.log("🗑️ Cleared existing faculty performance data.");
        const faculties = await User.find({ role: "faculty" });

        for (const faculty of faculties) {
            const exists = await FacultyPerformance.findOne({ facultyId: faculty._id });
            if (exists) {
                console.log(`ℹ️ Performance data already exists for: ${faculty.name}`);
                continue;
            }

            const newPerformance = new FacultyPerformance({
                facultyId: faculty._id,
                ...generateSamplePerformance(),
            });

            await newPerformance.save();
            console.log(`✅ Inserted performance data for: ${faculty.name}`);
        }

        console.log("🎉 Faculty performance seeding complete");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding faculty performance:", error);
        process.exit(1);
    }
};

seedFacultyPerformance();
