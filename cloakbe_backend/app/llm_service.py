from groq import Groq
import sys
import os

# Path hack to find the app root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# Temporary hardcoded context to bypass the import error for the demo
def load_context():
    return """
    Cloakbe Smart Locker System:
    - 20 Lockers available (A1-D5).
    - Authentication: Phone number + 6-digit OTP.
    - Statuses: EMPTY_CLOSED, OCCUPIED, MAINTENANCE.
    - Security: 120-second OTP timeout.
    """
from app.secrets import GROQ_API_KEY # Import from your secrets.py

client = Groq(api_key=GROQ_API_KEY)

context = load_context()

def ask_ai(message):
    system_prompt = f"""
    You are an assistant for a Smart Locker System.
    System context:
    {context}
    """

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )

    return completion.choices[0].message.content
if __name__ == "__main__":
    print("🤖 Testing AI Response...")
    print(ask_ai("How many lockers are available?"))