export async function getStatus() {
    const response = await fetch('https://leetcode.com/api/problems/algorithms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    return response.json()
  }
  
export async function getQuestion(questions) {
    questions = questions.filter(question => question.status === null)
  
    const numOfQuestions = questions.length
    const questionNumber = Math.floor(Math.random() * numOfQuestions)
    const question = questions[questionNumber]
  
    await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status, 'last_updated': (new Date()).toJSON()})
  }
  

export async function getQuestionStatus() {
  const result = await chrome.storage.sync.get(['question_status'])

  return result.question_status
}

export async function getDefaultStorage(key, defaultValue) {
    const result = await chrome.storage.sync.get([key]);
    if (!(key in result)) {
        await chrome.storage.sync.set({key: defaultValue});
        return defaultValue
    }

    return result[key];
}

export async function getBlockedDomains() {  
    return getDefaultStorage("blockedDomains", []);
}