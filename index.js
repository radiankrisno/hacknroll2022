const go = document.getElementById("go");
const message = document.getElementById("message");
const login = document.getElementById("login");
const dashboard = document.getElementById('dashboard')
const questionLink = document.getElementById('questionLink')
const questionFinished = document.getElementById('questionFinished')

document.addEventListener("DOMContentLoaded", handleLoad);

async function countdown() {
  console.log('LOL')
  const result = await chrome.storage.sync.get(['last_updated'])
  console.log(result.last_updated)
  console.log(new Date(result.last_updated))
  console.log('kekekek')
  console.log('tes')
}

async function handleLoad(event) {
  event.preventDefault()

  const status = await getStatus()

  if (status.user_name === '') {
    login.hidden = false
  } else {
    dashboard.hidden = false
    const questions = status.stat_status_pairs
    let result = await chrome.storage.sync.get(['title_slug'])
    if (!('title_slug' in result)) {
      await getQuestion(questions)
      result = await chrome.storage.sync.get(['title_slug'])
    }

    const temp = await chrome.storage.sync.get(['question_status'])

    await countdown()

    const question = questions.filter(question => question.stat.question__title_slug === result.title_slug)
    
    if (question[0].status === 'ac') {
      await chrome.storage.sync.set({'question_status': question[0].status, 'last_updated': (new Date()).toJSON()})
    }

    questionLink.href = 'https://leetcode.com/problems/' + result.title_slug

    if (question[0].status === 'ac' || temp.question_status === 'skipped') {
      questionLink.hidden = true
      questionFinished.hidden = false
    }
  }
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
