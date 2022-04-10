const puppeteer = require("puppeteer");
let {answer} = require("./codes");

let{email , password} = require("./secrete");

let cTab;
let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],

});

browserOpenPromise
.then(function(browser ){
  
    console.log("Your Browser is Open");

    let allTabsPromise = browser.pages();
    return allTabsPromise;

})
.then(function(allTabsArr){

    cTab = allTabsArr[0];
    console.log("new Tab");
//URL to navigate page to
    let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");

    return visitingLoginPagePromise;

})

.then(function(data){
    console.log(data);
    console.log("hackerrank login page open");
   let emailWillBeTypedPromise = cTab.type("input[name='username']",email);
   return emailWillBeTypedPromise;
})

.then(function(){

    console.log("email is typed");
    let passwordWillBeTypedPromise = cTab.type("input[type='password']",password);
    return passwordWillBeTypedPromise;
})


.then(function(){

    console.log("email is typed");
    let willBeLoggedInPromise = cTab.click(
        ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );

    return willBeLoggedInPromise
})
.then( function() {
    console.log("logged into hackerrank sucessfully");
    //waitAndClick will wait for the selector to load , and then click on the node
    let algorithmTabWillBeOpenPromise = waitAndClick(
        "div[data-automation='algorithms']"  
    )
    return algorithmTabWillBeOpenPromise
})
.then(function(){
    console.log("algorithm pages is opened");
    let allQuesPromise = cTab.waitForSelector(
        'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuesPromise

})
.then(function(){
  
    function getAllQuesLinks() {
        let allElemArr = document.querySelectorAll(
            'a[data-analytics="ChallengeListChallengeName"]'
        );

        let linksArr = [];
        for(let i = 0 ; i < allElemArr.length ; i++){
            linksArr.push(allElemArr[i].getAttribute("href"));
        }
        return linksArr;
    }

    let linksArrPromise = cTab.evaluate(getAllQuesLinks);
    return linksArrPromise;


})
.then(function(linksArr) {
    console.log("links to all ques received");
    console.log(linksArr);
    //  bss question solve krne hai
 
    let questionWillBeSolvedPromise = questionSolver(linksArr[0] , 0);
    for(let i = 1 ; i < linksArr.length ; i++){
        questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
            return questionSolver(linksArr[i] , i);
        })
    }
    return questionWillBeSolvedPromise
})
.then(function () {
    console.log("question is solved");
  })

.catch(function (err) {
    console.log(err);
  });

function waitAndClick(algobtn) {

    let waitClickPromise = new Promise(function (resolve , reject) {
        let waitForSelectorPromise = cTab.waitForSelector(algobtn);
        waitForSelectorPromise
        .then(function() {
            console.log("algo btn is found");
            let clickPromise = cTab.click(algobtn);
            return clickPromise;
        })
        .then(function () {
            console.log("algo btn is clicked");
            resolve();
        })
        .catch(function(err) {
           reject(err);
        })
    });
    return waitClickPromise;

}

function questionSolver(url , idx){
    return new Promise(function (resolve , reject) {
        let fullLink = `https://www.hackerrank.com${url}`;
        let goTOQuesPagePromise = cTab.goto(fullLink);
        goTOQuesPagePromise
        .then(function () {
            console.log("question opened");

            let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
            return waitForCheckBoxAndClickPromise
        })
     .then (function () {
         let waitForTextBoxPromise = cTab.waitForSelector(".custominput");
         return waitForTextBoxPromise;
     })
     .then( function () {
         let codeWillBeTypedPromise = cTab.type(".custominput", answer[idx]);
         return codeWillBeTypedPromise;
     })
     .then(function () {
         let controlPressedPromise = cTab.keyboard.down("Control");
         return controlPressedPromise;
     })

     .then(function () {
        let aKeyPressedPromise = cTab.keyboard.press("a");
        return aKeyPressedPromise;
      })
      .then(function () {
        let xKeyPressedPromise = cTab.keyboard.press("x");
        return xKeyPressedPromise;
      })
      .then( function () {
          let ctrlIsReleasedPromise = cTab.keyboard.up("Control");
          return ctrlIsReleasedPromise
        })
      
        .then(function () {
            let cursorOnEditorPromise = cTab.click(
                ".monaco-editor.no-user-select.vs"
              );
              return cursorOnEditorPromise;
        })

        .then( function () {

            let controlPressedPromise = cTab.keyboard.down("Control");
            return controlPressedPromise;
        })

        .then(function (){
            let aKeyPressedPromise = cTab.keyboard.press("A",{delay:100});
            return aKeyPressedPromise
        })
        .then(function () {
            let vKeyPressedPromise = cTab.keyboard.press("V",{delay:100});
            return vKeyPressedPromise;
          })

          .then(function () {
              let controlDownPromise = cTab.keyboard.up("Control")
              return controlDownPromise;
          })

          .then(function() {
              let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
              return submitButtonClickedPromise;
          })

          .then(function () {
              console.log("code submitted successfully");
              resolve();
          })

          .catch(function(err){
              reject(err);
          });





    });
}





