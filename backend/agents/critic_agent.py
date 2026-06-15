import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def critic_agent(state):

    prompt = f"""
    You are an expert startup critic AI.

    Review all reports carefully.

    Identify:
    - unrealistic assumptions
    - budget problems
    - scalability issues
    - weak marketing plans
    - technical risks
    - revenue inconsistencies

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "finance_feedback": [],
        "developer_feedback": [],
        "marketing_feedback": [],
        "overall_feedback": []
    }}


    PARSED STARTUP:
    {json.dumps(state.get("parsed_idea", {}), indent=2)}

    RESEARCH REPORT:
    {json.dumps(state['research'], indent=2)}

    FINANCE REPORT:
    {json.dumps(state['finance'], indent=2)}

    DEVELOPER REPORT:
    {json.dumps(state['developer'], indent=2)}

    MARKETING REPORT:
    {json.dumps(state['marketing'], indent=2)}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    if not isinstance(data, dict):
        data = {
            "finance_feedback": [],
            "developer_feedback": [],
            "marketing_feedback": [],
            "overall_feedback": []
        }

    return {
        "critic": data
    }