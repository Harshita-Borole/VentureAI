import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def developer_revision_agent(state):

    prompt = f"""
    You are a senior AI software architect.

    Improve the developer roadmap using critic feedback.

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "frontend": "",
        "backend": "",
        "database": "",
        "ai_stack": [],
        "deployment": "",
        "mvp_features": [],
        "development_steps": []
    }}

    CURRENT DEVELOPER REPORT:
    {json.dumps(state['developer'], indent=2)}

    CRITIC FEEDBACK:
    {json.dumps(state['critic']['developer_feedback'], indent=2)}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    return {
        "developer": data
    }