import logging
import os
import shutil
import subprocess
import argparse

import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

from run_studybuddy import load_model

from run_studybuddy import retrieval_qa_pipline
from werkzeug.utils import secure_filename

from utils import SimpleCallback

from constants import PERSIST_DIRECTORY, MODEL_ID, MODEL_BASENAME

if torch.backends.mps.is_available():
    DEVICE_TYPE = "mps"
elif torch.cuda.is_available():
    DEVICE_TYPE = "cuda"
else:
    DEVICE_TYPE = "cpu"

SHOW_SOURCES = True
logging.info(f"Running on: {DEVICE_TYPE}")
logging.info(f"Display Source Documents set to: {SHOW_SOURCES}")

LLM = load_model(
    device_type=DEVICE_TYPE, model_id=MODEL_ID, model_basename=MODEL_BASENAME
)

QA = retrieval_qa_pipline(device_type=DEVICE_TYPE, use_history=True)

app = Flask(__name__)
CORS(app,origins="*")
socketio = SocketIO(app, debug=True, cors_allowed_origins="*")

@socketio.on("connect")
def connect():
    print("Client connected")


@socketio.on("disconnect")
def disconnect():
    print("Client disconnected")


@app.route("/api/upload_document", methods=["POST"])
def upload_document_route():
    if "document" not in request.files:
        return "No document part", 400
    file = request.files["document"]
    if file.filename == "":
        return "No selected file", 400
    if file:
        filename = secure_filename(file.filename)
        folder_path = "SOURCE_DOCUMENTS"
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)
        return "File saved successfully", 200


@app.route("/api/delete_source", methods=["GET"])
def delete_source_route():
    folder_name = "SOURCE_DOCUMENTS"

    if os.path.exists(folder_name):
        shutil.rmtree(folder_name)

    os.makedirs(folder_name)

    return jsonify(
        {"message": f"Folder '{folder_name}' successfully deleted and recreated."}
    )


@app.route("/api/run_ingest", methods=["GET"])
def run_ingest_route():
    try:
        if os.path.exists(PERSIST_DIRECTORY):
            try:
                shutil.rmtree(PERSIST_DIRECTORY)
            except OSError as e:
                print(f"Error: {e.filename} - {e.strerror}.")
        else:
            print("The directory does not exist")

        run_langest_commands = ["python", "ingest.py"]
        if DEVICE_TYPE == "cpu":
            run_langest_commands.append("--device_type")
            run_langest_commands.append(DEVICE_TYPE)

        result = subprocess.run(run_langest_commands, capture_output=True)
        if result.returncode != 0:
            return (
                "Script execution failed: {}".format(result.stderr.decode("utf-8")),
                500,
            )
        return (
            "Script executed successfully: {}".format(result.stdout.decode("utf-8")),
            200,
        )
    except Exception as e:
        return f"Error occurred: {str(e)}", 500


@socketio.on("prompt")
def handle_prompt(user_prompt: str):
    callbacks = [SimpleCallback(socketio)]
    if user_prompt:
        print(f"User Prompt: {user_prompt}")
        # Get the answer from the chain
        res = QA.invoke({"query": user_prompt}, {"callbacks": callbacks})
        answer, docs = res["result"], res["source_documents"]

        prompt_response_dict = {
            "Prompt": user_prompt,
            "Answer": answer,
        }

        prompt_response_dict["Sources"] = []
        for document in docs:
            if "About.txt" in os.path.basename(str(document.metadata["source"])):
                continue
            prompt_response_dict["Sources"].append(
                (
                    os.path.basename(str(document.metadata["source"])),
                    str(document.page_content),
                )
            )

        return socketio.emit("final-answer", prompt_response_dict)
    else:
        return "No user prompt received", 400


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to run the API on. Defaults to 5000.",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="localhost",
        help="Host to run the UI on. Defaults to localhost",
    )
    args = parser.parse_args()

    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(message)s",
        level=logging.INFO,
    )
    socketio.run(app, debug=False, host=args.host, port=args.port)
