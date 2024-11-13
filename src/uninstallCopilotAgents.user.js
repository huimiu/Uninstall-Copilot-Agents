// ==UserScript==
// @name         Uninstall Copilot Agents
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Uninstall Copilot Agents that you created
// @author       Siglud
// @source       https://github.com/huimiu/Uninstall-Copilot-Agents/row/main/src/uninstallCopilotAgents.user.js
// @namespace    https://github.com/huimiu/Uninstall-Copilot-Agents/row/main/src/uninstallCopilotAgents.user.js
// @match        https://www.office.com/chat?auth=2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  const event = new Event('change', { bubbles: true });
  const button = document.createElement('input');
  button.type = 'button';
  button.value = 'Clear All Apps';
  button.onclick = () => {
      clearAll();
  };

  retryUntilElementReady(() => document.querySelector('main'), (contentArea) => {
      contentArea.appendChild(button);
      console.log('Button added');
  }, 'still waiting for main content area');

  function clearAll() {
      const delBtn = document.querySelector(".ui-table__cell button");
      if (!delBtn) {
          alert('All Apps Cleared!');
          return;
      }

      delBtn.click();
      retryUntilElementReady(() => document.querySelector(".ui-popup__content li:nth-child(3) a"), (panel) => {
          panel.click();
          retryUntilElementReady(() => document.querySelector(".ui-box>div[role='dialog'] span"), (verifyColumn) => {
              retryUntilElementReady(() => document.querySelector(".ui-box>div[role='dialog'] section input"), (input) => {
                  input.value = verifyColumn.innerText;
                  input._valueTracker.setValue('');
                  input.dispatchEvent(event);
                  retryUntilElementReady(() => document.querySelector('.ui-dialog__footer button:nth-child(2)'), (deleteButton) => {
                      deleteButton.click();
                      retryUntilElementReady(() => document.querySelector('div[role="alert"] button'), (doneBtn) => {
                          doneBtn.click();
                          clearAll();
                      }, 'still waiting for done button');
                  }, 'still waiting for delete button');
              }, 'still waiting for verify column');
          }, 'still waiting for verify column');
      }, 'still waiting for delete button');
  }

  function retryUntilElementReady(selector, callback, errorLog) {
      const interval = setInterval(() => {
          const element = selector();
          if (element) {
              clearInterval(interval);
              callback(element);
          } else {
              if (errorLog) {
                  console.log(errorLog)
              }
          }
      }, 1000);
  }
})();