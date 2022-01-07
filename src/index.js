import { getStatus, getQuestion, getQuestionStatus } from "./utils.js"

const login = document.getElementById("login");
const dashboard = document.getElementById('dashboard')
const questionLink = document.getElementById('questionLink')
const questionFinished = document.getElementById('questionFinished')

document.addEventListener("DOMContentLoaded", handleLoad);

async function countdown() {
  const result = await chrome.storage.sync.get(['last_updated'])
  const trigger = new Date(result.last_updated)
  trigger.setDate(trigger.getDate() + 1)
  
  const current = new Date()

  if (current > trigger) {
    const status = await getStatus();
    const questions = status.stat_status_pairs;
  
    await getQuestion(questions);
  }
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

    await countdown()

    const temp = await getQuestionStatus();

    const question = questions.filter(question => question.stat.question__title_slug === result.title_slug)
    
    if (question[0].status === 'ac') {
      await chrome.storage.sync.set({'question_status': question[0].status, 'last_updated': (new Date()).toJSON()})
    }

    questionLink.href = 'https://leetcode.com/problems/' + result.title_slug

    if (question[0].status === 'ac' || temp === 'skipped') {
      questionLink.hidden = true
      questionFinished.hidden = false
    }
  }
}
