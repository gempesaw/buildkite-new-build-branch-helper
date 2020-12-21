/* global chrome */

const doTheThing = () => {
  const parentSelectors = [
    'div[data-testid=PipelineHeader]',
    '#pipeline-header',
  ];
  const parentElem = getAnElementProbably(parentSelectors);

  const observeConfig = {
    attribute: false,
    childList: true,
    subtree: true
  };

  const observer = new MutationObserver(helpMeBranchHelper);
  observer.observe(parentElem, observeConfig);

  return observer;
};

const getAnElementProbably = (selectors) => selectors
  .map((selector) => document.querySelectorAll(selector)[0])
  .find(identity);

const helpMeBranchHelper = (mutationList, observer) => {
  // Use traditional 'for loops' for IE 11
  for(const mutation of mutationList) {
    if (mutation.type === 'childList') {
      const branchInputSelector = 'input[name="build[branch]"]';
      const branchInput = getAnElementProbably([branchInputSelector]);
      if (!branchInput) {
        return;
      }

      const imHelping = findABranch();
      branchInput.value = imHelping;
    }
  }
};

const findABranch = () => getAnElementProbably([
  '.branch',
  '.better-branch-panel-name'
])?.innerText;

const identity = it => it;

const observer = doTheThing();
window.onbeforeunload = () => observer.disconnect();
