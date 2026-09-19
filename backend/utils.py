from langchain.callbacks.base import BaseCallbackHandler

class SimpleCallback(BaseCallbackHandler):

    def __init__(self,socketio):
        self.socketio=socketio
        self.answer = ''

    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"LLM Start triggered with prompt - {prompts}")
        
    def on_llm_new_token(self, token: str, **kwargs):
        self.answer += token
        self.socketio.emit('answer',self.answer)