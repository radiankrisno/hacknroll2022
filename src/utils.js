export async function fetchLC() {
    const response = await fetch('https://leetcode.com/api/problems/algorithms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    return response.json()
  }

function getQuestion(questions, filterRule = x => true) {
    questions = questions.filter(question => question.status === null).filter(filterRule);
  
    const questionNumber = Math.floor(Math.random() * questions.length);
    const question = questions[questionNumber];

    return question;
}

export async function generateNewQuestion(lcData) {
    const questions = lcData.stat_status_pairs;
    const filterRule = await getDefaultStorage("difficulty", -1).then(difficulty => (question => difficulty == -1 ? true : question.difficulty.level == difficulty));

    return getQuestion(questions, filterRule);
}

export async function setQuestion(question) {
    await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status, 'last_updated': (new Date()).toJSON()});
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