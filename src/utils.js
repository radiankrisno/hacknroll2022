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
  
    await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status})
  }
  

export async function getQuestionStatus() {
  const result = await chrome.storage.sync.get(['question_status'])

  return result.question_status
}

export async function getBlockedDomains() {
    const result = await chrome.storage.sync.get(['blockedDomains'])
    if (!('blockedDomains' in result)) {
      await chrome.storage.sync.set({'blockedDomains': []})
      return []
    }
  
    return result.blockedDomains
  }