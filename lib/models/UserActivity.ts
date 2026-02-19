import mongoose from 'mongoose'

const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    codeReviewsCount: { type: Number, default: 0 },
    resumeAnalysesCount: { type: Number, default: 0 },
    lastCodeReviewAt: { type: Date },
    lastResumeAnalysisAt: { type: Date },
    // Store last resume analysis score for quick display
    lastResumeScore: { type: Number },
    lastCodeReviewScore: { type: Number },
  },
  { timestamps: true }
)

export const UserActivity =
  mongoose.models.UserActivity ?? mongoose.model('UserActivity', userActivitySchema)
