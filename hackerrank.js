const puppeteer = require("puppeteer");

let email = "vikasayushsharma@gmail.com";
let password = "************";

let cTab;
let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],

});

browserOpenPromise
.then(function(browser){
  
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

})
.catch(function(err){
    console.log(err);
})

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
        })
        .catch(function(err) {
            console.log(err);
        })
    });
    return waitClickPromise;

}

