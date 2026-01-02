# ResumeAI Optimizer
An AI Powered web application that analyzes your resume against Job Description and provides optimization suggestions.

## What can you expect :
* Color coded ATS score for your resume (0-100)
* Identifies missing keywords
* Highlights Strengths and weaknesses
* Provides rewrite suggestions for various resume sections

## Technology Stack :
* **React** : Frontend Framework
* **TypeScript** : Adds type safety to JS
* **google/genai** : Google's GeminiAI SDK for analysis
* **pdfjs-dist** : PDF Text Extraction
* **recharts** : Data visualization for score chart

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-xVtNn2qgJvhQib1saj4SynesBj9PhaF

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
