/* global chrome */

const BK_ENV_VAR_PREFIX = 'bkEnvVarPrefix-';

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

  const observer = new MutationObserver(helpMeNewBuildHelper);
  observer.observe(parentElem, observeConfig);

  return observer;
};

const getAnElementProbably = (selectors) => selectors
  .map((selector) => document.querySelectorAll(selector)[0])
  .find(identity);


const fillInBuildFromPage = (mutationList, observer) => {
  const branchInputSelector = 'input[name="build[branch]"]';
  const branchInput = getAnElementProbably([branchInputSelector]);
  if (!branchInput) {
    return;
  }

  const imHelping = findABranch();
  branchInput.value = imHelping;
};

const makeEnvironmentVariablesSticky = (mutationList, observer) => {
  const detailsInput = document.querySelectorAll('.details-reset')[0];
  const envVarTextarea = document.querySelectorAll('textarea[name="build[env]"]')[0];
  if (!detailsInput || !envVarTextarea) {
    return;
  }

  const localStorageKeyWithSlug = `${ BK_ENV_VAR_PREFIX }${window.location.pathname.split('/').reverse()[0]}`;
  const imHelping = window.localStorage[localStorageKeyWithSlug] || '';
  if (imHelping) {
    detailsInput.setAttribute('open', true);
    envVarTextarea.value = imHelping;
  }

  envVarTextarea.addEventListener("change", ({ target: { value } }) => {
    window.localStorage[localStorageKeyWithSlug] = value;
  });
};

const helpMeNewBuildHelper = (mutationList, observer) => {
  if (mutationList.some(probablyClickedNewBuild)) {
    fillInBuildFromPage(mutationList, observer);
    makeEnvironmentVariablesSticky(mutationList, observer);
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
if (observer) {
  window.onbeforeunload = observer.disconnect.bind(observer);
}
