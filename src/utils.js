export async function fetchLC() {
    const response = await fetch('https://leetcode.com/api/problems/algorithms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    return response.json()
  }

  
export async function generateNewQuestion(lcData) {
    const filterRule = await (Promise.all([
        getDefaultStorage("difficulty", -1).then(difficulty => (question => difficulty == -1 ? true : question.difficulty.level == difficulty)), 
        getDefaultStorage("paidOnlySetting", 1).then(paidOnlySetting => (question => paidOnlySetting == 0 ? true : question.paid_only == false))
    ]).then(fns => (x => fns.map(f => f(x)).reduce((a, b) => a&&b))));
    
    const questions = lcData.stat_status_pairs.filter(question => question.status === null).filter(filterRule);
  
    const questionNumber = Math.floor(Math.random() * questions.length);
    const question = questions[questionNumber];

    await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status, 'last_updated': (new Date()).toJSON()});

    return question;
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