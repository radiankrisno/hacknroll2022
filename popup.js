const skip = document.getElementById('skip')
const generate = document.getElementById('generate')
const message = document.getElementById('message')

skip.addEventListener('click', handleClickSkip)
generate.addEventListener('click', handleClickGenerate)

async function handleClickSkip(event) {
  event.preventDefault();

  await chrome.storage.sync.set({'question_status': 'skipped', 'last_updated': (new Date()).toJSON()})
}

async function handleClickGenerate(event) {
  event.preventDefault();

  const status = await getStatus()
  const questions = status.stat_status_pairs

  await getQuestion(questions)
}

async function getStatus() {
  const response = await fetch('https://leetcode.com/api/problems/algorithms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  return response.json()
}

async function getQuestion(questions) {
  questions = questions.filter(question => question.status === null)

  const numOfQuestions = questions.length
  const questionNumber = Math.floor(Math.random() * numOfQuestions)
  const question = questions[questionNumber]

  await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status, 'last_updated': (new Date()).toJSON()})
}
