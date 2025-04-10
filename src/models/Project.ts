import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleEng: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Graphic', 'Identity', 'Motion/Video', 'Editorial', 'Website'],
  },
  year: {
    type: Number,
    required: true,
  },
  client: String,
  description: String,
  descriptionEng: String,
  subImages: [{
    url: String,
    caption: String,
    captionEng: String,
  }],
  video: {
    url: String,
    type: {
      type: String,
      enum: ['youtube', 'vimeo'],
    },
  },
  credits: [{
    role: String,
    name: String,
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 