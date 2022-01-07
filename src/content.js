import { getQuestionStatus, getBlockedDomains } from "./utils.js"

const basicStyle = `display:flex;justify-content:center;align-items:center;padding:70px 0;`
function resetPage() {
  const resultingPage = 
  `
  <div style=${basicStyle}>
    <p style="font-size: xxx-large;">Domain is blocked! Do your LeetCode question first!</p>
  </div>
  `;

  document.documentElement.innerHTML = resultingPage;
  document.documentElement.scrollTop = 0;

}

function blockEntire(text){
  const current = window.location.href;
  if(current.includes(text)){
    resetPage();
  }
}

export async function main() {
  const blockedDomains = await getBlockedDomains()
  const questionStatus = await getQuestionStatus();

  if (blockedDomains.length === 0) {
    return;
  }

  if (questionStatus === 'ac' || questionStatus === 'skipped') {
    return
  }

  for (const blockedDomain of blockedDomains) {
    blockEntire(blockedDomain)
  }
}