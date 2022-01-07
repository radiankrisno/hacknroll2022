import { getStatus } from "./utils.js"

const skip = document.getElementById('skip')
const skipText = document.getElementById('skipText')
const skipLoader = document.getElementById('skipLoader')
const generate = document.getElementById('generate')
const generateText = document.getElementById('generateText')
const generateLoader = document.getElementById('generateLoader')

skip.addEventListener('click', handleClickSkip)
generate.addEventListener('click', handleClickGenerate)

async function handleClickSkip(event) {
  event.preventDefault();

  skipText.hidden = true
  skipLoader.hidden = false

  await chrome.storage.sync.set({'question_status': 'skipped', 'last_updated': (new Date()).toJSON()})

  skipText.hidden = false
  skipLoader.hidden = true
}

async function handleClickGenerate(event) {
  event.preventDefault();

  generateText.hidden = true
  generateLoader.hidden = false

  const status = await getStatus();
  const questions = status.stat_status_pairs;

  generateText.hidden = false
  generateLoader.hidden = true

  await getQuestion(questions);
}

async function getQuestion(questions) {
  questions = questions.filter(question => question.status === null)

  const numOfQuestions = questions.length
  const questionNumber = Math.floor(Math.random() * numOfQuestions)
  const question = questions[questionNumber]

  await chrome.storage.sync.set({'title_slug': question.stat.question__title_slug, 'question_status': question.status, 'last_updated': (new Date()).toJSON()})
}
