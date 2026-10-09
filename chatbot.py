# chatbot.py

import json
from groq import Groq

client = Groq()

MODEL = "openai/gpt-oss-120b"


def chat(message):
    """Return a response to the user's message."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful student learning assistant."
            },
            {"role": "user", "content": message}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content


def generate_assignment(topic, num_questions=15):
    """Generate MCQs with four options and correct answers."""

    num_questions = max(15, min(20, num_questions))

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an educational question generator. "
                    "Return valid JSON only."
                )
            },
            {
                "role": "user",
                "content": f"""
Generate {num_questions} multiple-choice questions
on the topic: {topic}

Requirements:
- Every question must have exactly four options.
- Options must be labelled A, B, C, D.
- Include the correct answer.
- Include a short explanation.

Return this JSON structure:
{{
  "topic": "{topic}",
  "questions": [
    {{
      "question": "Question text",
      "options": {{
        "A": "Option 1",
        "B": "Option 2",
        "C": "Option 3",
        "D": "Option 4"
      }},
      "correct_answer": "A",
      "explanation": "Short explanation"
    }}
  ]
}}
"""
            }
        ],
        temperature=0.4,
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)


def evaluate_assignment(questions, student_answers):
    """
    Evaluate answers.

    questions: Assignment dictionary returned by generate_assignment()
    student_answers: Dictionary such as {1: "A", 2: "C"}
    """

    question_list = questions["questions"]
    total = len(question_list)
    score = 0
    results = []

    for index, question in enumerate(question_list, start=1):
        correct = question["correct_answer"].strip().upper()
        student = str(
            student_answers.get(index, "")
        ).strip().upper()

        if student == correct:
            score += 1
            status = "Correct"
        else:
            status = "Incorrect"

        results.append({
            "question_number": index,
            "student_answer": student or "Not answered",
            "correct_answer": correct,
            "status": status,
            "explanation": question.get("explanation", "")
        })

    percentage = round((score / total) * 100, 2) if total else 0

    feedback_prompt = f"""
You are a supportive student mentor.

Assignment topic: {questions.get("topic", "General")}
Score: {score}/{total}
Percentage: {percentage}%

Answer results:
{json.dumps(results, indent=2)}

Provide:
1. A brief performance analysis.
2. Specific suggestions for improvement.
3. Topics the student should revise.
4. Encouragement and motivation.

Return valid JSON only, using these keys:
{{
  "performance_analysis": "...",
  "improvement_suggestions": ["...", "..."],
  "topics_to_revise": ["...", "..."],
  "motivation": "..."
}}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful and encouraging student mentor."
            },
            {"role": "user", "content": feedback_prompt}
        ],
        temperature=0.5,
        response_format={"type": "json_object"}
    )

    feedback = json.loads(response.choices[0].message.content)

    return {
        "score": score,
        "total_questions": total,
        "percentage": percentage,
        "results": results,
        "feedback": feedback
    }


def change_timetable(old_timetable, performance):
    """Create a revised timetable based on student performance."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a student study-planning assistant. "
                    "Return valid JSON only."
                )
            },
            {
                "role": "user",
                "content": f"""
Create an improved study timetable using the information below.

OLD TIMETABLE:
{json.dumps(old_timetable, indent=2)}

STUDENT PERFORMANCE:
{json.dumps(performance, indent=2)}

Requirements:
- Give more study time to weak subjects.
- Include revision and practice tests.
- Keep the schedule realistic.
- Include breaks and adequate rest.
- Preserve important existing commitments where possible.

Return JSON in this structure:
{{
  "reason_for_changes": "...",
  "timetable": [
    {{
      "day": "Monday",
      "schedule": [
        {{
          "time": "6:00 PM - 7:00 PM",
          "subject": "Subject name",
          "activity": "What to study"
        }}
      ]
    }}
  ],
  "recommendations": ["...", "..."]
}}
"""
            }
        ],
        temperature=0.4,
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)


if __name__ == "__main__":
    print("Testing Groq Chatbot Service...")
    sample_reply = chat("Hello, how can you help me with Operating Systems?")
    print("Chat response preview:", sample_reply[:200])
