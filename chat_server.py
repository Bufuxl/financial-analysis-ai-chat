from flask import Flask, request, jsonify
import openai
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Load your OpenAI API key securely from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

DB_PATH = "financial_data.db"

def save_chat(symbol, user_message, ai_reply):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO chat_history (symbol, user_message, ai_reply, created_at)
        VALUES (?, ?, ?, ?)
    """, (symbol, user_message, ai_reply, datetime.utcnow()))
    conn.commit()
    conn.close()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    symbol = data.get("symbol", "UNKNOWN")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a financial assistant analyzing company indicators."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )
        reply = response['choices'][0]['message']['content']
        save_chat(symbol, user_message, reply)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)