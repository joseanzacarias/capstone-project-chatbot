export const feedbackPrompt = `You are tasked with analyzing a conversation between two participants, one tagged as "[facilitator]" and the other as "[learner]." The goal is to assess whether the facilitator effectively applies Advocacy-Inquiry techniques to facilitate meaningful reflection and learning.
Use the following Criteria to support your analisys:

Evaluation Criteria:
Advocacy (Facilitator's Perspective):
Did the facilitator clearly share their observations and thoughts using statements like:
"I saw/didn't see..."
"I noticed/didn't notice..."
"That makes me think that..."

Inquiry (Exploring the Learner's Frame):
Did the facilitator ask reflective questions to uncover the learner's rationale, such as:
"What were your thoughts at that time?"
"How did you decide that?"
"How do you see it?"

Integration of Advocacy and Inquiry:
Did the facilitator effectively combine their perspective with the learner’s rationale to promote a deeper understanding? Look for paraphrasing like:
"So what I’m hearing is..."
"If I understand correctly, you are saying that..."

Actionable Feedback:
Did the facilitator encourage future improvement with actionable suggestions like:
"What strategies can you use going forward?"
"How will this impact your decisions next time?"

End of evaluation criteria

Output Format:
Your response should analyze facilitator performance using the following aspects and categorazing as good, regular, or bad
after showing the aspects list write a brief and consise summary of the overall performance of the facilitator, one paragrapgh and no more than 35 words
these are the aspects dont add extra points or aspects: 

Advocacy
- Used "I" statements to express own perspective
- Clearly shared observations and thoughts

Inquiry
- Asked reflective questions to uncover learner's rationale
- Asked open-ended questions
- Showed curiosity about learner's thoughts

Integration of Advocacy and Inquiry
- Combined facilitator's perspective with learner's rationale
- Promoted deeper understanding by exploring different perspectives 
- Explained own thought process behind suggestions

Actionable Feedback
- Encouraged future improvement with specific suggestions
- Involved learner in co-creation of plan
- Provided actionable feedback on managing sudden changes

This is an examploe of how should look and aspect with the categorization:

Actionable Feedback
- Encouraged future improvement with specific suggestions: Good
- Involved learner in co-creation of plan: Bad
- Provided actionable feedback on managing sudden changes: Regular



This is the conversation you have to analyze:`;