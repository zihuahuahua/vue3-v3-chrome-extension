<template>
  <main>
    <div class="container">
      <div class="row">

        <div class="flex-box">
          <!-- header-area start -->
          <header class="header-area">
            <div class="container">
              <nav>
                <div class="logo">
                  <a href="#">
                    <ul>
                      <li><img :src="logo2" class="img-fluid" alt=""></li>
                      <li>GPTAnywhere</li>
                    </ul>
                  </a>
                </div>
                <div class="x-icon">
                  <a href="#"><img :src="Shape" class="img-fluid" alt="" id="x-icon"></a>
                </div>
              </nav>
            </div>
          </header>
          <!-- header-area end -->

          <!-- Enter your prompt area-start -->
          <section class="keyword-area">
            <div class="container" id="container">
              <div class="keyword-potmpt-form">
                <div action="#">
                  <input type="search" placeholder="Enter your prompt!" id="input-el">
                  <div class="submit-">
                    <button type="submit" id="submit-btn" ><img :src="arrow" class="img-fluid" alt=""></button>
                  </div>
                </div>
              </div>
              <div class="key-word-inner" id="content-El" ref="contentElRef"> <!-- Output --> </div>
            </div>
          </section>
          <!-- Enter your prompt area-end -->
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Browser from "webextension-polyfill";
import { onMounted ,computed, ref} from "vue";
const logo2 = computed(() => chrome.runtime.getURL(`assets/logo2.png`));
const Shape = computed(() => chrome.runtime.getURL(`assets/Shape.png`));
const arrow = computed(() => chrome.runtime.getURL(`assets/arrow.png`));

const run = (contentEl,question) =>{ 
  
if(contentEl){

  // loading for port Message...
  contentEl.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>'; 

  const port = chrome.runtime.connect(); 
  console.log(port,"port")
  // port Listener
  port.postMessage({ question });
  port.onMessage.addListener(function (msg) {
    console.log(msg,"msg")
    if (msg.answer) {
      console.log("answer: " + msg.answer) // <-- Console.Log 1

      contentEl.innerHTML = '<p><span class="prefix">ChatGPT:</span><pre></pre></p>';
      // Answer Output
      contentEl.querySelector("pre").textContent = msg.answer;

    } else {
      contentEl.innerHTML = `
      <section class="hero-area">
        <div class="container">
            <div class="hero-inner-item">
                <h2>🖖 You are nearly ready!</h2>
                <p>You need to login into your openAI <br> Account first!</p>
                <a href="https://chat.openai.com/auth/login" target="_blank">Login</a>
            </div>
        </div>
    </section>
    `;
    }
  });
  }
}

onMounted(() => { 
  const searchInput = document.getElementById('input-el') as HTMLInputElement | null;
  const buttonEl = document.getElementById('submit-btn') as HTMLInputElement | null;
  const xIcon = document.getElementById("x-icon") as HTMLInputElement | null;
  const contentEl = document.getElementById("content-El") as HTMLDivElement;
  buttonEl&& buttonEl.addEventListener("click", () => {
    console.log("button clicked");
    if (searchInput && searchInput.value) {
      console.log("Input.Value:" + searchInput.value);
      run(contentEl,searchInput.value);
    }
  });
  // Eventlistener keypress - Enter
  searchInput&&searchInput.addEventListener("keypress",(event)=>{
    if(event.key === "Enter"){
      if (searchInput && searchInput.value) {
        console.log("Input.Value:" + searchInput.value);
        run(contentEl,searchInput.value);
      }
      event.preventDefault()
    }
  });

  xIcon&& xIcon.addEventListener("click",()=>{
    window.close();
  })
});
</script>
<style src="./css/responsive.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&family=Poppins:wght@400;500;600;700;800;900&display=swap');

/*
========================
Header area start
========================
*/

*,
*::before,
*::after {
  box-sizing: border-box;
}

a{
  text-decoration: none;
}
ul,li{
  padding: 0;
  margin: 0;
  list-style: none;
}
body {	
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;   
  background-color: #484C57;
	color: #777E91;	
  margin: 0;
  min-width: 400px;
}

.container {
    min-width: 580px;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
}
.key-word-inner{
  color: #fff;
}
.row {
    display: flex;
    flex-wrap: wrap;
}
.row > div {
    padding-left: 10px;
    padding-right: 10px;
    
}

.img-fluid {
  max-width: 80%;
}

.col-50 {
  width: 50%;
}
main {
  padding-top: 20px;

}
.header-area {
  background-color: #353945;
  border-radius: 16px 16px 0px 0px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 19px;
  color: #FCFCFD;
}

.logo a ul {
  display: flex;
  align-items: center;
}

.x-icon {
  width: 30px;
  height: 30px;
  background-color: #EF466F;
  border-radius: 50%;
  text-align: center;
  line-height: 31px;
}

/* ===hero-area-start=== */

.hero-area {
  padding: 42px 0;
  background-color: #23262F;
  border-radius: 0px 0px 16px 16px;
  margin-bottom: 30px;
} 
.hero-inner-item {
  text-align: center;
}
.hero-inner-item h2{
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  text-align: center;
  color: #FCFCFD;
  margin-bottom: 25px;
} 
.hero-inner-item p{
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  text-align: center;
  color: #777E91;
  margin-bottom: 25px;
  
  
} 
.hero-inner-item a{
  font-family: 'DM Sans';
  font-style: normal;
  font-size: 18px;
  display: inline-block;
  padding: 10px 77px;
  display: inline-block;
  color: #fff;
  text-align: center;
  background-color: #45B26B;
  border-radius: 90px;
  transition: .2s;

} 
.hero-inner-item a:hover{
  background-color: #33834f;
} 

/* ==Enter your prompt area-start - */
.keyword-area {
  padding-top: 40px;
  background-color: #23262F;
  padding-bottom: 15px;
  border-radius: 0px 0px 16px 16px;
  margin-bottom: 20px;
}
.keyword-potmpt-form {
  position: relative;
}
.keyword-potmpt-form div input{
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #777E91;
  width: 80%;
  padding: 15px 16px;
  background: #F4F5F6;
  border-radius: 16px;
  outline: none;
  border: none;
}

.submit- {
  position: absolute;
  top: 8px;
  right: 8px;
}
.submit- button{
  border: none;
  outline: none;
  background: #45B36B;
  border-radius: 12px;
  padding: 11px 9px;
  text-align: center;
}
.key-word-inner p {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 35px;
  color: rgb(204, 198, 198);
  font-family: 'Poppins';

}
.key-word-inner pre{
  color: rgb(204, 198, 198);
  font-family: 'Poppins';

  font-size: 15px;
  white-space: pre-wrap;
  min-width: 0;
  margin-bottom: 0;
  line-height: 20px;

}

.submit- button img {
  width: 20px;
  cursor: pointer;
}
.code-snippet-box{
  height: 200px;
  background-color: #fff;
  border-radius: 17px;
  margin-bottom: 40px;
}
.code-snippet-box p{
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: #FCFCFD;
  background-color: #353945;
  padding: 15px ;
  border-radius: 16px 16px 0px 0px;
  
}

.x-icon img {
  width: 11px;
}
.x-icon {
  width: 25px;
  height: 25px;
  background-color: #EF466F;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
}

/*===== end page ======= */
</style>