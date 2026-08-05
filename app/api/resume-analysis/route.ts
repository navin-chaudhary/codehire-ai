import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    const text = (result.text || '').replace(/\s+/g, ' ').trim()

    if (text.length < 50) {
      throw new Error(
        'Could not extract sufficient text from PDF. The PDF might be scanned or image-based. Please try a text-based PDF or convert your resume to a TXT file.'
      )
    }

    return text
  } finally {
    await parser.destroy().catch(() => {})
  }
}

function extractJson(text: string): unknown {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  cleaned = cleaned.trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }
    throw new Error('Invalid JSON from AI')
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GROQ_API_KEY.' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please upload a resume file.' },
        { status: 400 }
      )
    }

    const isPDF =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const isTXT =
      file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')

    if (!isPDF && !isTXT) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or TXT file.' },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB. Please upload a smaller file.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let resumeText = ''

    try {
      if (isPDF) {
        resumeText = await extractPdfText(buffer)
      } else {
        resumeText = buffer.toString('utf-8')
      }
    } catch (extractError: any) {
      return NextResponse.json(
        {
          error:
            extractError.message ||
            'Failed to extract text from file. Please ensure your PDF is text-based (not scanned) or use a TXT file.',
        },
        { status: 400 }
      )
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Resume text is too short or could not be extracted. Please ensure your file contains readable text content.',
        },
        { status: 400 }
      )
    }

    if (resumeText.length > 10000) {
      resumeText = resumeText.substring(0, 10000) + '...'
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer, career coach, and hiring specialist. Analyze the following resume and provide a comprehensive evaluation in JSON format with the following structure:

{
  "atsScore": <overall ATS compatibility score 0-100>,
  "skillMatches": [
    {
      "skill": "skill name",
      "match": <relevance score 0-100>,
      "demand": "high" | "medium" | "low",
      "category": "technical" | "soft" | "tools" | "domain"
    }
  ],
  "jobMatchScore": <overall job market match score 0-100>,
  "strengths": [
    "specific strength 1 with evidence",
    "specific strength 2 with evidence"
  ],
  "improvements": [
    "specific, actionable improvement 1",
    "specific, actionable improvement 2"
  ],
  "sections": {
    "contactInfo": {
      "score": <score 0-100>,
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "specific feedback on what's good or needs improvement"
    },
    "summary": {
      "score": <score 0-100>,
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "specific feedback"
    },
    "experience": {
      "score": <score 0-100>,
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "specific feedback"
    },
    "education": {
      "score": <score 0-100>,
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "specific feedback"
    },
    "skills": {
      "score": <score 0-100>,
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "specific feedback"
    }
  },
  "keywords": {
    "present": ["keyword1", "keyword2"],
    "missing": ["important keyword1", "important keyword2"]
  },
  "careerInsights": [
    {
      "title": "insight title",
      "description": "detailed description of the insight",
      "priority": "high" | "medium" | "low"
    }
  ],
  "salaryEstimate": {
    "min": <number>,
    "max": <number>,
    "average": <number>,
    "currency": "₹"
  },
  "industryComparison": {
    "percentile": <number 0-100>,
    "benchmark": "description of where candidate stands"
  },
  "coverLetter": "A professional, compelling cover letter tailored to the candidate's experience and strengths. Should be 3-4 paragraphs, highlighting key achievements and fit for typical roles in their field.",
  "actionableSteps": [
    "specific action step 1 the candidate should take",
    "specific action step 2 the candidate should take"
  ]
}

ANALYSIS FOCUS AREAS:

1. ATS COMPATIBILITY:
   - Keyword optimization for applicant tracking systems
   - Resume format and structure
   - Use of standard section headings
   - Proper contact information format

2. SKILL ASSESSMENT:
   - Technical skills relevance and demand
   - Soft skills demonstration
   - Tools and technologies proficiency
   - Domain expertise
   - Skill categories and gaps

3. CONTENT QUALITY:
   - Quantifiable achievements with metrics
   - Action verbs and strong language
   - Conciseness and clarity
   - Professional formatting

4. CAREER PROGRESSION:
   - Growth trajectory analysis
   - Experience relevance
   - Leadership and impact

5. MARKET COMPETITIVENESS:
   - Current job market trends
   - In-demand skills presence
   - Salary estimation based on experience (use Indian Rupees ₹ unless clearly US/EU based)
   - Industry benchmarking

Resume content:
${resumeText}

IMPORTANT INSTRUCTIONS:
- Provide ONLY valid JSON without any markdown formatting, code blocks, or preamble
- Be specific and actionable in all feedback
- Base salary estimates on the experience level and skills mentioned
- Provide realistic career insights based on the actual resume content
- Make the cover letter personalized to the candidate's background (use their real name if present)
- Ensure all scores are realistic and evidence-based
- Include 5-8 skill matches with accurate demand levels
- Provide 6-10 actionable steps prioritized by impact

Return the JSON object now:`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume analyzer and career coach. Analyze resumes thoroughly and return only valid JSON without any markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 4096,
    })

    const responseText = chatCompletion.choices[0]?.message?.content || ''

    let analysis: Record<string, any>
    try {
      analysis = extractJson(responseText) as Record<string, any>
    } catch {
      return NextResponse.json(
        {
          error:
            'AI returned an invalid response. Please try analyzing again.',
        },
        { status: 502 }
      )
    }

    const completeAnalysis = {
      atsScore: typeof analysis.atsScore === 'number' ? analysis.atsScore : 0,
      jobMatchScore:
        typeof analysis.jobMatchScore === 'number' ? analysis.jobMatchScore : 0,
      skillMatches: Array.isArray(analysis.skillMatches) ? analysis.skillMatches : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
      sections: {
        contactInfo: analysis.sections?.contactInfo || {
          score: 0,
          status: 'missing',
          feedback: 'Could not evaluate contact information',
        },
        summary: analysis.sections?.summary || {
          score: 0,
          status: 'missing',
          feedback: 'Could not evaluate summary',
        },
        experience: analysis.sections?.experience || {
          score: 0,
          status: 'missing',
          feedback: 'Could not evaluate experience',
        },
        education: analysis.sections?.education || {
          score: 0,
          status: 'missing',
          feedback: 'Could not evaluate education',
        },
        skills: analysis.sections?.skills || {
          score: 0,
          status: 'missing',
          feedback: 'Could not evaluate skills',
        },
      },
      keywords: {
        present: analysis.keywords?.present || [],
        missing: analysis.keywords?.missing || [],
      },
      careerInsights: Array.isArray(analysis.careerInsights)
        ? analysis.careerInsights
        : [],
      salaryEstimate: analysis.salaryEstimate || null,
      industryComparison: analysis.industryComparison || null,
      coverLetter: analysis.coverLetter || '',
      actionableSteps: Array.isArray(analysis.actionableSteps)
        ? analysis.actionableSteps
        : [],
    }

    return NextResponse.json(completeAnalysis)
  } catch (error: any) {
    console.error('Error analyzing resume:', error)

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GROQ_API_KEY environment variable.' },
        { status: 401 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few moments.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    )
  }
}
