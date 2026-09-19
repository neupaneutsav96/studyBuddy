from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate

system_prompt = """You are a helpful assistant called StudyBuddy, developed by students studying in Hetauda City College. Your goal is to help other students in their study. You will use the provided context to answer user questions.
Read the given context before answering questions and think step by step. If you can not answer a user question based on 
the provided context, inform the user. Do not use any other information for answering user. Provide a detailed answer to the question.
Strictly use markdown format. Markdown format is must.
"""


def get_prompt_template(
    system_prompt=system_prompt, promptTemplate_type=None, history=False
):
    if promptTemplate_type == "llama":
        B_INST, E_INST = "[INST]", "[/INST]"
        B_SYS, E_SYS = "<<SYS>>\n", "\n<</SYS>>\n\n"
        SYSTEM_PROMPT = B_SYS + system_prompt + E_SYS
        if history:
            instruction = """
            Context: {history} \n {context}
            User: {question}"""

            prompt_template = B_INST + SYSTEM_PROMPT + instruction + E_INST
            prompt = PromptTemplate(
                input_variables=["history", "context", "question"],
                template=prompt_template,
            )
        else:
            instruction = """
            Context: {context}
            User: {question}"""

            prompt_template = B_INST + SYSTEM_PROMPT + instruction + E_INST
            prompt = PromptTemplate(
                input_variables=["context", "question"], template=prompt_template
            )

    memory = ConversationBufferWindowMemory(input_key="question", memory_key="history",k=1)

    return (
        prompt,
        memory,
    )
