/**
 * Groq AI Service
 * Connects to Groq OpenAI-compatible API using model "openai/gpt-oss-120b"
 * Implements chat, assignment generation, evaluation, and adaptive timetable recalculation.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export const GROQ_MODEL = "openai/gpt-oss-120b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function getGroqApiKey() {
  if (!GROQ_API_KEY) {
    throw new Error("Missing VITE_GROQ_API_KEY. Configure it in your local environment.");
  }
  return GROQ_API_KEY;
}

/**
 * 1. chat(message)
 * Return a response to the user's message from a helpful student learning assistant.
 */
export async function chatGroq(message, systemPrompt = "You are a helpful and supportive student learning mentor.") {
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Groq chat error:', errText);
      throw new Error(`Groq HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.warn("Groq API error in chatGroq:", err);
    throw err;
  }
}

/**
 * 2. generate_assignment(topic, num_questions=15)
 * Generate MCQs with four options and correct answers.
 */
export async function generateAssignmentGroq(topic, numQuestions = 15) {
  const boundedCount = Math.max(5, Math.min(20, numQuestions));

  const prompt = `Generate ${boundedCount} multiple-choice questions on the topic: ${topic}

Requirements:
- Every question must have exactly four options.
- Options must be labelled A, B, C, D.
- Include the correct answer.
- Include a short explanation.

Return this JSON structure:
{
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text",
      "options": {
        "A": "Option 1",
        "B": "Option 2",
        "C": "Option 3",
        "D": "Option 4"
      },
      "correct_answer": "A",
      "explanation": "Short explanation"
    }
  ]
}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an educational question generator. Return valid JSON only."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    return JSON.parse(rawContent);
  } catch (err) {
    console.warn("Groq assignment generation error:", err);
    throw err;
  }
}

/**
 * 3. evaluate_assignment(questions, student_answers)
 * Evaluates student answers and returns mentor feedback.
 */
export async function evaluateAssignmentGroq(questions, studentAnswers) {
  const questionList = questions?.questions || [];
  const total = questionList.length;
  let score = 0;
  const results = [];

  questionList.forEach((question, index) => {
    const qNum = index + 1;
    const correct = (question.correct_answer || '').trim().toUpperCase();
    const student = String(studentAnswers[qNum] || studentAnswers[question.id] || '').trim().toUpperCase();

    const isCorrect = student === correct;
    if (isCorrect) score += 1;

    results.append ? null : results.push({
      question_number: qNum,
      student_answer: student || "Not answered",
      correct_answer: correct,
      status: isCorrect ? "Correct" : "Incorrect",
      explanation: question.explanation || ""
    });
  });

  const percentage = total ? Math.round((score / total) * 100 * 100) / 100 : 0;

  const feedbackPrompt = `You are a supportive student mentor.

Assignment topic: ${questions.topic || "General"}
Score: ${score}/${total}
Percentage: ${percentage}%

Answer results:
${JSON.stringify(results, null, 2)}

Provide:
1. A brief performance analysis.
2. Specific suggestions for improvement.
3. Topics the student should revise.
4. Encouragement and motivation.

Return valid JSON only, using these keys:
{
  "performance_analysis": "...",
  "improvement_suggestions": ["...", "..."],
  "topics_to_revise": ["...", "..."],
  "motivation": "..."
}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful and encouraging student mentor."
          },
          { role: "user", content: feedbackPrompt }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawFeedback = data.choices?.[0]?.message?.content;
    const feedback = JSON.parse(rawFeedback);

    return {
      score,
      total_questions: total,
      percentage,
      results,
      feedback
    };
  } catch (err) {
    console.warn("Groq evaluate assignment error:", err);
    throw err;
  }
}

/**
 * 4. change_timetable(old_timetable, performance)
 * Create a revised timetable based on student performance.
 */
export async function changeTimetableGroq(oldTimetable, performance) {
  const prompt = `Create an improved study timetable using the information below.

OLD TIMETABLE:
${JSON.stringify(oldTimetable, null, 2)}

STUDENT PERFORMANCE:
${JSON.stringify(performance, null, 2)}

Requirements:
- Give more study time to weak subjects.
- Include revision and practice tests.
- Keep the schedule realistic.
- Include breaks and adequate rest.
- Preserve important existing commitments where possible.

Return JSON in this structure:
{
  "reason_for_changes": "...",
  "timetable": [
    {
      "day": "Monday",
      "schedule": [
        {
          "time": "6:00 PM - 7:00 PM",
          "subject": "Subject name",
          "activity": "What to study"
        }
      ]
    }
  ],
  "recommendations": ["...", "..."]
}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a student study-planning assistant. Return valid JSON only."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    return JSON.parse(rawContent);
  } catch (err) {
    console.warn("Groq timetable recalculation error:", err);
    throw err;
  }
}
