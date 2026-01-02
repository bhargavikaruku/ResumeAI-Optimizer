<img width="1581" height="885" alt="image" src="https://github.com/user-attachments/assets/9475d6cc-dbcd-4a12-90c5-f3f89c5313b2" />

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

# View the deployed application on github pages using the link
<https://bhargavikaruku.github.io/ResumeAI-Optimizer/>

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
