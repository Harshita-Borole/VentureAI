import json


def parse_llm_json(response):

    try:

        content = response.content

        if isinstance(content, list):

            content = " ".join(
                [
                    item.get("text", str(item))
                    if isinstance(item, dict)
                    else str(item)
                    for item in content
                ]
            )

        content = str(content)

        content = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        start = content.find("{")
        end = content.rfind("}")

        if start == -1 or end == -1:
            return {}

        json_text = content[start:end + 1]

        parsed = json.loads(json_text)

        return parsed

    except Exception as e:

        print("\nJSON PARSE ERROR")
        print(str(e))

        try:
            print(content)
        except:
            pass

        return {}