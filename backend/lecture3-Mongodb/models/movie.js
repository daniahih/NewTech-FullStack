import mongoose from "mongoose";

const moiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    genre: {
      type: String,
      enum: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"],
    },
    year: {
      type: Number,
    },
    director: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    releaseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Moive", moiveSchema);

export default Movie;
