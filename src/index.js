import { fetchLC, getQuestionStatus, generateNewQuestion } from "./utils.js"

const login = document.getElementById("login");
const dashboard = document.getElementById('dashboard')
const doQuestion = document.getElementById('doQuestion')
const questionLink = document.getElementById('questionLink')
const questionFinished = document.getElementById('questionFinished')
const questionTitle = document.getElementById('questionTitle')
const questionDifficulty = document.getElementById('questionDifficulty')

document.addEventListener("DOMContentLoaded", handleLoad);

const difficulties = {
  '1': 'easy',
  '2': 'medium',
  '3': 'hard',
}

async function countdown() {
  const result = await chrome.storage.sync.get(['last_updated'])
  const trigger = new Date(result.last_updated)
  trigger.setDate(trigger.getDate() + 1)
  
  const current = new Date()

  if (current > trigger) {
    const lcData = await fetchLC();
    const questions = lcData.stat_status_pairs;
    
    await generateNewQuestion(questions);
  }
}

async function handleLoad(event) {
  event.preventDefault()

  const lcData = await fetchLC();
  const questions = lcData.stat_status_pairs;

  // if not logged in
  if (lcData.user_name === '') {
    login.hidden = false
    return
  } 

  dashboard.hidden = false;

  const getLocalQuestion = () => chrome.storage.sync.get(['title_slug']).then(result => {
    if(!('title_slug' in result)) {
      return generateNewQuestion(lcData);
    }
    return Promise.resolve({"stat": {"question__title_slug": result.title_slug}});
  }).then(x => x.stat.question__title_slug);

  const [result, _, localQuestionStatus] = await Promise.all([
    getLocalQuestion(),
    countdown(),
    getQuestionStatus()
  ]);

  const question = questions.filter(question => question.stat.question__title_slug === result)[0];
  
  if (question.status === 'ac') {
    await chrome.storage.sync.set({'question_status': question.status, 'last_updated': (new Date()).toJSON()})
  }

  questionLink.href = 'https://leetcode.com/problems/' + result
  questionTitle.innerHTML = question.stat.frontend_question_id + '. ' + question.stat.question__title
  questionDifficulty.innerHTML = 'Difficulty: ' + difficulties[question.difficulty.level]

  if (question.status === 'ac' || localQuestionStatus === 'skipped') {
    doQuestion.style.display = "none";
    questionFinished.style.display = "flex";
  }
  
}
