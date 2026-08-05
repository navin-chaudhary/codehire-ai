import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

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

    const { code, language } = await request.json()

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    if (code.length > 100000) {
      return NextResponse.json(
        { error: 'Code is too large. Please analyze a smaller file (under 100KB).' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert code reviewer with expertise in bug detection, security analysis, performance optimization, and code quality assessment.

Analyze the following ${language || 'code'} and provide a comprehensive review in JSON format with the following structure:

{
  "score": <overall code quality score 0-100>,
  "issues": [
    {
      "type": "error" | "warning" | "info",
      "category": "bug" | "performance" | "security" | "quality" | "structure",
      "message": "detailed description of the issue",
      "severity": "high" | "medium" | "low",
      "line": <line number if applicable>,
      "suggestion": "how to fix this issue"
    }
  ],
  "suggestions": [
    "actionable improvement suggestion 1",
    "actionable improvement suggestion 2"
  ],
  "codeQuality": {
    "readability": <score 0-100>,
    "maintainability": <score 0-100>,
    "performance": <score 0-100>,
    "security": <score 0-100>
  },
  "bestPractices": [
    "best practice recommendation 1",
    "best practice recommendation 2"
  ],
  "securityAnalysis": {
    "vulnerabilities": [
      "vulnerability description 1",
      "vulnerability description 2"
    ],
    "riskLevel": "critical" | "high" | "medium" | "low",
    "recommendations": [
      "security improvement 1",
      "security improvement 2"
    ]
  },
  "performanceInsights": {
    "slowPatterns": [
      "description of slow pattern or anti-pattern 1",
      "description of slow pattern or anti-pattern 2"
    ],
    "optimizations": [
      "specific optimization opportunity 1",
      "specific optimization opportunity 2"
    ]
  },
  "refactoringOpportunities": [
    "refactoring suggestion 1",
    "refactoring suggestion 2"
  ]
}

Key analysis areas:

1. BUG DETECTION:
   - Identify logical errors
   - Find syntax issues
   - Detect runtime risks
   - Spot edge cases not handled
   - Find null/undefined issues

2. SECURITY ANALYSIS:
   - Identify vulnerabilities (SQL injection, XSS, CSRF, etc.)
   - Check for unsafe API usage
   - Validate input validation
   - Check for hardcoded secrets/credentials
   - Assess authentication/authorization issues
   - Check for insecure data handling

3. PERFORMANCE OPTIMIZATION:
   - Detect slow code patterns
   - Find unnecessary loops or iterations
   - Identify memory leaks
   - Check for inefficient algorithms
   - Spot excessive re-renders (for React/frontend)
   - Find blocking operations

4. CODE QUALITY & STRUCTURE:
   - Assess code organization
   - Check naming conventions
   - Evaluate function/method size
   - Check for code duplication
   - Assess coupling and cohesion
   - Evaluate error handling

5. BEST PRACTICES:
   - Language-specific best practices
   - Framework-specific recommendations
   - Industry standards compliance
   - Design patterns usage

Code to review:
\`\`\`${language || ''}
${code}
\`\`\`

IMPORTANT: 
- Provide specific, actionable feedback
- Include line numbers when possible
- Categorize each issue properly
- Be thorough but concise
- Focus on real issues, not minor style preferences
- Provide constructive suggestions
- Return ONLY valid JSON without any markdown formatting, preamble, or code blocks

Respond with the JSON object now:`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert code reviewer. Analyze code thoroughly and return only valid JSON without any markdown formatting or code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
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
            'AI returned an invalid response. Please try again with a smaller code snippet.',
        },
        { status: 502 }
      )
    }

    const completeAnalysis = {
      score: typeof analysis.score === 'number' ? analysis.score : 0,
      issues: Array.isArray(analysis.issues) ? analysis.issues : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      codeQuality: {
        readability: analysis.codeQuality?.readability ?? 0,
        maintainability: analysis.codeQuality?.maintainability ?? 0,
        performance: analysis.codeQuality?.performance ?? 0,
        security: analysis.codeQuality?.security ?? 0,
      },
      bestPractices: Array.isArray(analysis.bestPractices) ? analysis.bestPractices : [],
      securityAnalysis: {
        vulnerabilities: analysis.securityAnalysis?.vulnerabilities || [],
        riskLevel: analysis.securityAnalysis?.riskLevel || 'low',
        recommendations: analysis.securityAnalysis?.recommendations || [],
      },
      performanceInsights: {
        slowPatterns: analysis.performanceInsights?.slowPatterns || [],
        optimizations: analysis.performanceInsights?.optimizations || [],
      },
      refactoringOpportunities: Array.isArray(analysis.refactoringOpportunities)
        ? analysis.refactoringOpportunities
        : [],
    }

    return NextResponse.json(completeAnalysis)
  } catch (error: any) {
    console.error('Error analyzing code:', error)

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Groq API configuration.' },
        { status: 401 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze code. Please try again.' },
      { status: 500 }
    )
  }
}
