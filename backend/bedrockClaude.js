import dotenv from 'dotenv';
dotenv.config();

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// setup Bedrock client
const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


const promptText = `You are an intelligent profile validation and summarization system.

You are given various inputs related to a job applicant's profile, which may include:
•⁠  Resume content (as plain text or extracted from PDF)
•⁠  URLs to professional profiles (LinkedIn, GitHub, personal portfolio)
•⁠  Optional transcript or summary of a video introduction

Your task is to analyze this information and produce a structured, UI-ready summary of the candidate's profile. This summary should be clear, well-organized, and suitable for rendering on a web-based dashboard.

### Input Types:
{
  "id": 6,
  "name": "candidate name",
  "email": "candidate email",
  "resume": “images”,
  "projects": [
    "link1",
    "link2"
  ]
}

name - name of the candidate
email - email of the candidate
resume -  resume text from pdf 
projects -  list of websites 

<TASK>
Summarize and validate the candidate's profile by extracting the following information:

- Extract and summarize the following details from the provided text or sources: Full Name, Contact Information, Educational Background, Professional Experience (including roles, companies, and durations), Skills (both Technical and Soft), Certifications, Projects (if any), Relevant Links (such as LinkedIn, GitHub, Portfolio), and Language Proficiency. If any of these elements are present in the input, include them in the output. Provide only the details that can be confidently derived from the given content.

- Review the extracted profile information across all input sources. Identify any inconsistencies (e.g., mismatched job titles, overlapping dates, or conflicting skillsets). Flag these discrepancies clearly and, if possible, suggest the most reliable version based on available context.

- Generate a short, professional summary of the candidate's profile (3-5 sentences) that could be used by a recruiter or hiring manager. This should highlight the candidate' core strengths, notable achievements, and overall fit for a technical or professional role.

- Create a list of structured tags or keywords based on the candidate's experience, skills, and domains (e.g., #Python, #DataScience, #FrontendDeveloper, #AWS). These tags should help in categorizing the profile and enabling filter-based search in a recruitment platform.

- Create a list of structured tags or keywords based on the candidate's experience, skills, and domains (e.g., #Python, #DataScience, #FrontendDeveloper, #AWS). These tags should help in categorizing the profile and enabling filter-based search in a recruitment platform.

- If any GitHub or external link is provided, visit and analyze the content thoroughly. Extract key highlights such as notable projects, technologies used, contributions, or repositories of interest. Present these main points concisely. At the end, include hyperlinks to the original sources for deeper reference.

### Output Requirements:
Generate a complete HTML page (as text) that presents the candidate's profile in a visually appealing, modern, and responsive layout. Incorporate CSS and JavaScript as needed to enhance user experience and interactivity. The page must include all the key profile elements outlined in the task, such as personal details, education, experience, skills, projects, certifications, links, language proficiency, and a summary of the video introduction if available. Also, if any external links like GitHub or LinkedIn are provided, display summarized highlights with direct hyperlinks to the original sources for more details.`;

// message

/*
[
    {
        "type": "text",
        "text": promptText,
    }
    ]
*/

async function invokeClaude(content) {
    const input = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        messages: [
            {
                role: "user",
                content: [...content, {
                    "type": "text",
                    "text": `${promptText}`
                  }
                ]
            }
        ],
        temperature: 0.7,
        top_p: 0.8,
        top_k: 250,
        stop_sequences: ["\n\nHuman:"]
    };

    const payload = {
        body: JSON.stringify(input),
        modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Claude 3.5 Haiku
        contentType: "application/json",
        accept: "application/json"
    };

    const command = new InvokeModelCommand(payload);
    const response = await client.send(command);

    const decoded = JSON.parse(new TextDecoder().decode(response.body));
    // console.log("Claude's response:", decoded.content[0].text);

    // console.log(`response============> ${response}`)

    return decoded;
}

export default invokeClaude;