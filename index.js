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
    fetchLoadingMessage(userInput);
    fetchDesign(userInput);
  }
});

// Get the loading message to display
async function fetchLoadingMessage(prompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `
      Generate a short message to enthusiastically say a prompt sounds interesting to turn into a logo,
      and that you need some minutes to think about it.
    ###
      description: A basketball team called the Comets.
      message: I'll need to think about that. But that idea is fantastic! The Comets is a great name for a basketball team.
    ###
      design: A company that sells firewood.
      message: That's an awesome idea for a company! I'll spend a few moments considering how best to design a logo for that.
    ###
      design: ${prompt}
      message: 
    `,
    max_tokens: 60 
  });
  caydeText.innerText = response.data.choices[0].text.trim();
}

// Get the logo design
async function fetchDesign(prompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `
      Generate a design for a logo based on a prompt. The design should include detailed descriptions
      about what the logo would like like, and why those design choices were made.
    ###
      design: Generate a logo for a basketball team called the Comets.
      description: A stylized depiction of a comet streaking across the sky, with a basketball incorporated into its tail.
      The comet's tail will be a gradient from white to fiery orange, which pairs nicely with a metallic silver for the basketball.
      The logo features a dynamic and vibrant comet, symbolizing the team's speed and energy on the basketball court. The basketball in the comet's tail reinforces the basketball association. The use of a fiery gradient adds excitement and drama, while the metallic silver basketball stands out and adds a touch of elegance.
    ###
      design: Generate a logo for ${prompt}
      description:
    `,
    max_tokens: 700
  });
  const design = response.data.choices[0].text.trim();
  document.getElementById('output-text').innerText = design;
  fetchImageUrl(design);
}

// Generate a logo image
async function fetchImageUrl(imagePrompt){
  const response = await openai.createImage({
    prompt: `${imagePrompt}`,
    n: 1,
    size: '256x256',
    response_format: 'b64_json' 
  })
  document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${response.data.data[0].b64_json}">`;
  setupInputContainer.innerHTML = `<button id="view-logo-btn" class="view-logo-btn">View Logo</button>`;
  document.getElementById('view-logo-btn').addEventListener('click', ()=>{
    document.getElementById('setup-container').style.display = 'none';
    document.getElementById('output-container').style.display = 'flex';
    caydeText.innerText = `This idea is so good I'm jealous! It's going to garner so much attention. Enjoy!`;
  });
}
