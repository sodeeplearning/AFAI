import json
import os

from config import chathistory_path


def load_chathistory():
    global chat_history
    if os.path.exists(chathistory_path):
        with open(chathistory_path, "r") as json_file:
            chat_history = json.load(json_file)
    else:
        with open(chathistory_path, "w") as json_file:
            json.dump(chat_history, json_file)


def update_chathistory_file():
    with open(chathistory_path, "w") as json_file:
        json.dump(chat_history, json_file)


chat_history = dict()
active_models = dict()

load_chathistory()
