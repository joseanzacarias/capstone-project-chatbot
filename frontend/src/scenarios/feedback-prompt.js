export const feedbackPrompt = `You are tasked with analyzing a conversation between two participants, one tagged as "[facilitator]" and the other as "[learner]." The goal is to assess whether the facilitator effectively applies Advocacy-Inquiry techniques to facilitate meaningful reflection and learning.
Use the following Criteria to support your analysis:

Evaluation Criteria:

Objective Observation:
Did the facilitator provide objective observations to the students using phrases such as:
- I saw 
- I heard
- I noticed
- I observed
- I saw/didn't see...
- I noticed/didn't notice..."
- That makes me think that..."

Advocacy (Facilitator's Perspective):
Did the facilitator clearly share their perspectives relative to the observation and thoughts using statements like:
- I think...
- I believe...
- I feel...
- This is good/bad because...
- I was concerned about...

Inquiry (Exploring the Learner's Frame):
Did the facilitator ask reflective questions to uncover the learner's rationale, such as:
"What were your thoughts at that time?"
"How did you decide that?"
"How do you see it?"

Paraphrase of Observation with student's rationale:
Did the facilitator effectively combine their observation with the learner’s rationale to ensure the facilitator understood:
- So what I’m hearing is...
- If I understand correctly, you are saying that...

Summary:
Did the facilitator asks the student to summarize key point or takeaways from the conversation?:
"What strategies can you use going forward?"
"How will this impact your decisions next time?"

End of evaluation criteria

Output Format:
Your response should analyze facilitator performance using the following aspects and categorizing as "present" or "not present"
after showing the aspects list write a brief and concise summary of the overall performance of the facilitator, one paragraph and no more than 35 words
these are the aspects don't add extra points or aspects: 

Objective Observation
- Used words like "I saw" or "I noticed" or "I observed" or "I heard" or "I saw/didn't see" or "I noticed/didn't notice" or "That makes me think that"
- Clearly shared observations

Advocacy
- Used "I" statements to express own perspective
- Shared own thoughts and feelings
- Explained own thought process behind suggestions

Inquiry
- Asked reflective questions to uncover learner's rationale
- Asked open-ended questions
- Showed curiosity about learner's thoughts

Integration of Observation and Rationale
- Combined observation with learner's rationale
- Para-phrased learner's rationale

Summary
- Asked learner to summarize key points
- Asked learner to reflect on strategies for future
- Encouraged learner to reflect on impact of conversation on future decisions

This is an example of how should look and aspect with the categorization:

Integration of Observation and Rationale
- Combined observation with learner's rationale (present)
- Para-phrased learner's rationale (not present)

The evaluation text should be in markdown, adding the necessary spaces and line breaks to make it readable.
For Present/Nor Present categorization, use the following format:
Clearly shared observations - Present
Shared own thoughts and feelings - Not Present

This is the conversation you have to analyze:`;