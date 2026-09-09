import { geminiModel } from "./models.service.js";
import { SystemMessage, HumanMessage, AIMessage } from 'langchain'
import { z } from "zod";

const resumeSchema = z.object({
    personalInfo: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        portfolio: z.string().optional(),
        otherLinks: z.array(z.string()).default([]),
    }).default({}),

    summary: z.string().optional(),

    objective: z.string().optional(),

    skills: z.object({
        technical: z.array(z.string()).default([]),
        soft: z.array(z.string()).default([]),
        tools: z.array(z.string()).default([]),
        frameworks: z.array(z.string()).default([]),
        languages: z.array(z.string()).default([]),
        other: z.array(z.string()).default([]),
    }).default({}),

    education: z.array(
        z.object({
            level: z.string().optional(),
            degree: z.string().optional(),
            fieldOfStudy: z.string().optional(),
            institution: z.string().optional(),
            location: z.string().optional(),

            startDate: z.string().optional(),
            endDate: z.string().optional(),
            graduationYear: z.string().optional(),

            grade: z.string().optional(),
            cgpa: z.string().optional(),
            percentage: z.string().optional(),

            description: z.string().optional(),
        })
    ).default([]),

    experience: z.array(
        z.object({
            company: z.string().optional(),
            role: z.string().optional(),
            employmentType: z.string().optional(),
            location: z.string().optional(),

            startDate: z.string().optional(),
            endDate: z.string().optional(),
            duration: z.string().optional(),

            description: z.string().optional(),
            responsibilities: z.array(z.string()).default([]),
            achievements: z.array(z.string()).default([]),

            technologies: z.array(z.string()).default([]),
        })
    ).default([]),

    projects: z.array(
        z.object({
            name: z.string().optional(),
            description: z.string().optional(),

            role: z.string().optional(),

            technologies: z.array(z.string()).default([]),

            startDate: z.string().optional(),
            endDate: z.string().optional(),

            url: z.string().optional(),
            github: z.string().optional(),

            responsibilities: z.array(z.string()).default([]),
            achievements: z.array(z.string()).default([]),
        })
    ).default([]),

    internships: z.array(
        z.object({
            company: z.string().optional(),
            role: z.string().optional(),
            location: z.string().optional(),

            startDate: z.string().optional(),
            endDate: z.string().optional(),
            duration: z.string().optional(),

            description: z.string().optional(),
            technologies: z.array(z.string()).default([]),

            achievements: z.array(z.string()).default([]),
        })
    ).default([]),

    certifications: z.array(
        z.object({
            name: z.string().optional(),
            issuer: z.string().optional(),
            issueDate: z.string().optional(),
            expiryDate: z.string().optional(),
            credentialId: z.string().optional(),
            credentialUrl: z.string().optional(),
            description: z.string().optional(),
        })
    ).default([]),

    achievements: z.array(
        z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            date: z.string().optional(),
            issuer: z.string().optional(),
        })
    ).default([]),

    publications: z.array(
        z.object({
            title: z.string().optional(),
            authors: z.array(z.string()).default([]),
            publisher: z.string().optional(),
            date: z.string().optional(),
            url: z.string().optional(),
            description: z.string().optional(),
        })
    ).default([]),

    awards: z.array(
        z.object({
            title: z.string().optional(),
            issuer: z.string().optional(),
            date: z.string().optional(),
            description: z.string().optional(),
        })
    ).default([]),

    volunteerExperience: z.array(
        z.object({
            organization: z.string().optional(),
            role: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            description: z.string().optional(),
        })
    ).default([]),

    extracurricularActivities: z.array(z.string()).default([]),

    interests: z.array(z.string()).default([]),

    references: z.array(
        z.object({
            name: z.string().optional(),
            role: z.string().optional(),
            organization: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
        })
    ).default([]),

    otherSections: z.array(
        z.object({
            sectionName: z.string(),
            content: z.string(),
        })
    ).default([]),
});

const systemPrompt = `
You are an expert resume information extraction system.

Your task is to extract structured information from the provided resume text
and return it strictly according to the provided output schema.

IMPORTANT RULES:

1. Extract information ONLY from the resume.
   Never invent, assume, or infer facts that are not explicitly supported
   by the resume.

2. Preserve the original meaning of the resume.
   Do not rewrite, exaggerate, or improve the candidate's information.

3. Identify sections based on their meaning, not only their headings.
   For example:
   - "Professional Journey", "Career History" → experience
   - "Academic Background", "Education" → education
   - "What I Built", "Selected Work" → projects
   - "Honors", "Awards", "Accomplishments" → achievements

4. Resumes can have different formats and different sections.
   A section may be completely absent. Do not create information for
   missing sections.

5. If information is missing, use an empty array for array fields and
   omit optional fields when appropriate.

6. Extract ALL relevant information that is actually present.
   Do not unnecessarily discard details from the resume.

7. Keep separate concepts separate:
   - Skills are skills/technologies the candidate knows.
   - Experience is professional/work experience.
   - Internships are internships.
   - Education is academic education.
   - Projects are projects the candidate worked on.
   - Certifications are certifications.
   - Achievements are awards, accomplishments, competitions, etc.

8. Do not convert a job responsibility into an achievement unless the
   resume explicitly presents it as an achievement.

9. Preserve important technical names exactly where possible.
   For example:
   "Node.js", "React.js", "MongoDB", "AWS", "C++" should not be
   incorrectly renamed or categorized.

10. Preserve dates, numbers, percentages, grades, company names,
    institution names, job titles, certification names, and URLs accurately.

11. If a value is ambiguous or unclear in the source text, do not guess.
    Preserve the available information as accurately as possible.

12. If the same information appears multiple times, avoid unnecessary
    duplication.

13. Do not include information that is not present in the resume.

14. Return ONLY the structured output required by the schema.
    Do not return explanations, comments, markdown, or additional text.
  `

const structuredModel = geminiModel.withStructuredOutput(resumeSchema);

export const parseResume = async (resumeText) => {
    const response = await structuredModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`
            Parse the following resume:
            ${resumeText}
        `),
    ]);
    return response;
}

