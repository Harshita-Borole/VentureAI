import json

from config.llm_config import llm
from memory.chroma_store import get_relevant_memory


def _clean_llm_response(response):
    """
    Converts ANY LLM output into clean readable text.
    Handles: str, dict, list, tool outputs
    """

    # Case 1: LangChain / Gemini response object
    if hasattr(response, "content"):
        response = response.content

    # Case 2: list output
    if isinstance(response, list):

        texts = []

        for item in response:

            if isinstance(item, dict):

                if "text" in item:
                    texts.append(item["text"])

                elif "content" in item:
                    texts.append(item["content"])

                elif "answer" in item:
                    texts.append(item["answer"])

            elif isinstance(item, str):
                texts.append(item)

        return "\n\n".join(texts).strip()

    # Case 3: dict output
    if isinstance(response, dict):

        if "text" in response:
            return response["text"]

        if "content" in response:
            return response["content"]

        return json.dumps(response, indent=2)

    # Case 4: string
    return str(response).strip()


def chat_agent(question, startup_context, chat_history=None):

    if chat_history is None:
        chat_history = []

    # ===================================
    # STARTUP CONTEXT
    # ===================================

    startup_context_str = json.dumps(
        startup_context,
        indent=2,
        ensure_ascii=False
    )

    chat_history_str = json.dumps(
        chat_history,
        indent=2,
        ensure_ascii=False
    )

    # ===================================
    # CHROMA MEMORY
    # ===================================

    try:
        memory = get_relevant_memory(question)
        memory_str = json.dumps(
            memory,
            indent=2,
            ensure_ascii=False
        )

    except Exception:
        memory_str = "No memory found."

    # ===================================
    # PROMPT
    # ===================================

    prompt = f"""
You are an elite startup advisor AI.

You act like:
- YC Partner
- Startup CTO
- VC Analyst

STARTUP CONTEXT:
{startup_context_str}

RELEVANT MEMORY:
{memory_str}

CHAT HISTORY:
{chat_history_str}

USER QUESTION:
{question}

RULES:

- NEVER return JSON
- NEVER use curly brackets
- NEVER use key:value format
- NEVER return code
- NEVER return markdown
- Reply only in natural English
- Maximum 10 lines
- Use bullet points
- Give direct answers
- Be actionable
- Use startup context
- Use memory when relevant
- End with one recommendation

EXAMPLE:

Your target audience is:

• College students
• Young professionals
• Early adopters

Recommendation:
Start with students because acquisition cost is lower.
"""

    # ===================================
    # LLM CALL
    # ===================================

    response = llm.invoke(prompt)

    # ===================================
    # CLEAN OUTPUT
    # ===================================

    answer = _clean_llm_response(response)

    # ===================================
    # HANDLE ACCIDENTAL JSON
    # ===================================

    try:

        parsed = json.loads(answer)

        if isinstance(parsed, dict):

            formatted = []

            for k, v in parsed.items():

                formatted.append(
                    f"• {k.replace('_', ' ').title()}: {v}"
                )

            answer = "\n".join(formatted)

        elif isinstance(parsed, list):

            answer = "\n".join(
                [f"• {item}" for item in parsed]
            )

    except Exception:
        pass

    return answer