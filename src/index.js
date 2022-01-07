import { fetchLC, getQuestion, setQuestion, getQuestionStatus, generateNewQuestion } from "./utils.js"

const login = document.getElementById("login");
const dashboard = document.getElementById('dashboard')
const doQuestion = document.getElementById('doQuestion')
const questionLink = document.getElementById('questionLink')
const questionFinished = document.getElementById('questionFinished')

document.addEventListener("DOMContentLoaded", handleLoad);

async function countdown() {
  const result = await chrome.storage.sync.get(['last_updated'])
  const trigger = new Date(result.last_updated)
  trigger.setDate(trigger.getDate() + 1)
  
  const current = new Date()

  if (current > trigger) {
    const lcData = await fetchLC();
    const questions = lcData.stat_status_pairs;
    
    // TODO: 
    const question = getQuestion(questions);
    await setQuestion(question);
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
      return generateNewQuestion(lcData,).title_slug;
    }
    return result;
  });

  const [result, _, localQuestionStatus] = await Promise.all([
    getLocalQuestion(),
    countdown(),
    getQuestionStatus()
  ]);

  const question = questions.filter(question => question.stat.question__title_slug === result.title_slug)[0]
  
  if (question.status === 'ac') {
    await chrome.storage.sync.set({'question_status': question.status, 'last_updated': (new Date()).toJSON()})
  }

  questionLink.href = 'https://leetcode.com/problems/' + result.title_slug

  if (question.status === 'ac' || localQuestionStatus === 'skipped') {
    doQuestion.style.display = "none";
    questionFinished.style.display = "flex";
  }
  
}
