import { process } from '/env';
import { Configuration, OpenAIApi } from 'openai';

const setupInputContainer = document.getElementById('setup-input-container');
const caydeText = document.getElementById('cayde-6-text');

// Setup configurations
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Process inputted prompts
document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea');
  if (setupTextarea.value) {
    const userInput = setupTextarea.value;
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`;
    caydeText.innerText = `Ok, just give me a second to process that with my digital brain...`;
  }
})
