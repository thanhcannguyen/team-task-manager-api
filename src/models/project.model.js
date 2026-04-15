
import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["planning", "in-progress", "completed"],
        default: "planning"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
})

const Project = mongoose.model("Project", projectSchema)

export default Project 