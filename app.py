import streamlit as st
import speech_recognition as sr
from gtts import gTTS
import tempfile
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

# Check if PyAudio is available
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False

# Azure AI setup
token = os.environ.get("GITHUB_TOKEN")
endpoint = "https://models.inference.ai.azure.com"
model_name = "Llama-3.2-90B-Vision-Instruct"

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = [
        SystemMessage(content="You are a helpful banking assistant. Provide information about banking services and answer customer queries.")
    ]

def transcribe_audio(audio_data):
    recognizer = sr.Recognizer()
    try:
        if isinstance(audio_data, sr.AudioData):
            text = recognizer.recognize_google(audio_data)
        else:
            with sr.AudioFile(audio_data) as source:
                audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Sorry, I couldn't understand the audio."
    except sr.RequestError:
        return "Sorry, there was an error processing your request."

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
        tts.save(fp.name)
        return fp.name

def process_query(text):
    st.session_state.messages.append(UserMessage(content=text))
    
    response = client.complete(messages=st.session_state.messages, model=model_name)
    bot_response = response.choices[0].message.content
    
    st.session_state.messages.append(AssistantMessage(content=bot_response))
    return bot_response

st.title("Banking Bot Voice Assistant")

if PYAUDIO_AVAILABLE:
    input_method = st.radio("Choose input method:", ("Upload Audio", "Live Microphone"))
else:
    st.warning("PyAudio is not installed. Live microphone input is not available.")
    input_method = "Upload Audio"

if input_method == "Upload Audio":
    uploaded_file = st.file_uploader("Choose an audio file", type=["wav", "mp3"])
    if uploaded_file is not None:
        st.audio(uploaded_file, format="audio/wav")
        text = transcribe_audio(uploaded_file)
        st.write(f"You said: {text}")
        
        response = process_query(text)
        st.write(f"Bot response: {response}")
        
        audio_file = text_to_speech(response)
        st.audio(audio_file, format="audio/mp3")
        os.unlink(audio_file)  # Clean up the temporary file

elif input_method == "Live Microphone":
    if st.button("Start Recording"):
        with st.spinner("Recording..."):
            recognizer = sr.Recognizer()
            try:
                with sr.Microphone() as source:
                    st.write("Listening...")
                    audio = recognizer.listen(source, timeout=5)
                st.success("Recording complete!")
                
                text = transcribe_audio(audio)
                st.write(f"You said: {text}")
                
                response = process_query(text)
                st.write(f"Bot response: {response}")
                
                audio_file = text_to_speech(response)
                st.audio(audio_file, format="audio/mp3")
                os.unlink(audio_file)  # Clean up the temporary file
            except sr.WaitTimeoutError:
                st.error("Listening timed out. Please try again.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

# Display chat history
st.subheader("Chat History")
for message in st.session_state.messages[1:]:  # Skip the system message
    if isinstance(message, UserMessage):
        st.write(f"You: {message.content}")
    elif isinstance(message, AssistantMessage):
        st.write(f"Bot: {message.content}")

st.write("Note: This banking bot is powered by Azure AI.")