# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from google.cloud import dialogflow_v2 as dialogflow
import os

# Path to your service account JSON key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "path/to/weglow-chatbot.json"

PROJECT_ID = "weglow-auth"
SESSION_ID = "current-user-session"  # can be any unique string per user

@api_view(['POST'])
def chat_with_bot(request):
    try:
        user_message = request.data.get('message')
        if not user_message:
            return Response({"reply": "Please type a message."})

        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(PROJECT_ID, SESSION_ID)

        text_input = dialogflow.TextInput(text=user_message, language_code="en")
        query_input = dialogflow.QueryInput(text=text_input)
        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )

        reply = response.query_result.fulfillment_text
        return Response({"reply": reply})
    except Exception as e:
        print("Dialogflow error:", e)
        return Response({"reply": "Oops! Something went wrong."})
