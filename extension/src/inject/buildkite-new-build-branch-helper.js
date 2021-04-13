/* global chrome */

const doTheThing = () => {
  const parentSelectors = [
    'div[data-testid=PipelineHeader]',
    '#pipeline-header',
  ];
  const parentElem = getAnElementProbably(parentSelectors);
  if (!parentElem) {
    return null;
  }

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
  if (mutationList.some(probablyClickedNewBuild)) {
    const branchInputSelector = 'input[name="build[branch]"]';
    const branchInput = getAnElementProbably([branchInputSelector]);
    if (!branchInput) {
      return;
    }

    const imHelping = findABranch();
    branchInput.value = imHelping;
  }
};

const probablyClickedNewBuild = ({type, addedNodes }) => {
  const nameOfClassOnDivWhenYouClickNewBuild = 'Dialog__Wrapper';
  const probablyAdded = Array.from(addedNodes).some((node) => node.classList.contains(nameOfClassOnDivWhenYouClickNewBuild));

  return type === 'childList' && probablyAdded;
};

const findABranch = () => getAnElementProbably([
  '.branch',
  '.better-branch-panel-name'
])?.innerText;

const identity = it => it;

const observer = doTheThing();
window.onbeforeunload = observer.disconnect.bind(observer);
