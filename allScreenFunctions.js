//discord, back btn, quick exit
//     const {createClient} = window.supabase;
//     const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
//     const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
//     const supabase = createClient(supabaseURL, supabaseAnonKey, {
//   global: {
//     fetch: (input, init) => {
//       return fetch(input, {
//         ...init,
//         credentials: 'include' // CRUCIAL: Sends cookies cross-origin
//       });
//     }
//   }
// });
window.addEventListener( "DOMContentLoaded", function() { //Might not work if user gets link from other website (cookies?) (make new array with session storage?) --> see line 33-ish
    console.log("Window history:", window.history)
    console.log("document referrer", document.referrer)
    if(sessionStorage.getItem("pageBack") == null) {
        alert("Press the logo at the bottom of the screen or the escape key to exit immediately.")
    }
});
window.addEventListener("load", async() =>{
    //favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'Images/logoCircle.png';
    const existingIcons = document.querySelectorAll('link[rel*="icon"]');
    existingIcons.forEach(icon => icon.remove());
    document.head.appendChild(link);

    //more sizing
    await resize();
    // if(window.innerWidth < 670){
    //     document.getElementById("siteName").style.visibility = "hidden";
    //     document.getElementById("dateEst").style.visibility = "hidden";
    // }else{
    //     document.getElementById("siteName").style.visibility = "visible";
    //     document.getElementById("dateEst").style.visibility = "visible";
    // }

    //for back btn
    if(sessionStorage.getItem("pageBack") == null || sessionStorage.getItem("pageBack") === ""){
        console.log("CREATED NEW");
        sessionStorage.setItem("pageBack", "[]");
    }
    console.log("Page back",sessionStorage.getItem("pageBack"));
    let pageBack =  JSON.parse(sessionStorage.getItem("pageBack"));
   // pageBack.push(window.location.href);
    if (pageBack[pageBack.length - 1] !== window.location.href) {
        pageBack.push(window.location.href);
    }
    console.log("History page",pageBack);
    sessionStorage.setItem("pageBack", JSON.stringify(pageBack));
    console.log("History string", sessionStorage.getItem("pageBack"));
    //back button
    if(document.getElementById("backBtn") != null) { //fix 4/23
        // const history = JSON.parse(sessionStorage.getItem("navHistory") || "[]");
        // // remove current page
        // history.pop();
        // // get last visited page
        // const last = history.pop();
        // console.log("last",last)
        // sessionStorage.setItem("navHistory", JSON.stringify(history));

        // let history = JSON.parse(sessionStorage.getItem("pageBack"));
        let pageBack =  JSON.parse(sessionStorage.getItem("pageBack"));
        console.log("History",pageBack);
        let lastPage = pageBack[pageBack.length - 2];
        console.log("History last page",lastPage);
        if (((!lastPage.includes("Signup") && !lastPage.includes("Login")) || (window.location.href.includes("Signup") || window.location.href.includes("Login"))) && !lastPage.includes("EditProfile") && !lastPage.includes("EditPost")) { //window.history? (gets referrer, which may not be actual last page)
            console.log("HERE IT IS :)");
            document.getElementById("backBtn").addEventListener("click", async () => {
                pageBack = pageBack.slice(0, -1);
                console.log("History",pageBack);
                window.location.href = lastPage;
                sessionStorage.setItem("pageBack", JSON.stringify(pageBack));

            });
        }else if(lastPage.includes("EditPost") && window.location.href.includes("Post")) {
            document.getElementById("backBtn").addEventListener("click", async () => {
                let postId = window.location.href.substring(window.location.href.lastIndexOf("/")+1)
                console.log(postId)
                let forumId = await supabase.from("forumPosts").select("forumId").eq('id', postId)
                forumId = forumId.data[0].forumId
                console.log(forumId);
                pageBack = pageBack.slice(0, -1);
                window.location.href ='forum.html?path=/'+forumId; //fix
                sessionStorage.setItem("pageBack", JSON.stringify(pageBack));
            });
        }else{
            document.getElementById("backBtn").addEventListener("click", async () => {
                window.location.href = 'Home.html';
                pageBack = pageBack.slice(0, -1);
            })
        }
        if((localStorage.getItem('postId') != null) /**&& () is document.refferer != post? (I think this was for refresh and is no longer needed, but I forget) */){
            localStorage.removeItem('postId');
        }
    }


    //user can't access pages past login if not logged in
    if(!(`${document.location}`).includes("Startup") && !(`${document.location}`).includes("Login") && !(`${document.location}`).includes("Signup") && !(`${document.location}`).includes("Error")){
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // Redirect to login page if not authenticated
            window.location.href = 'Error.html';
        }

    }

   //  await resize();

    //dark mode
    console.log("Current page", window.location.href);
    if(!window.location.href.includes("Error.html") && !window.location.href.includes("Login.html") && !window.location.href.includes("Signup.html") && !window.location.href.includes("Startup.html")) {
        let allElements = document.getElementsByTagName('*');
        console.log("All elements", allElements);
        console.log("running:", await supabase.auth.getSession());
        console.log(supabase);
        const session = await supabase.auth.getSession();
        if (!session) {
            console.log("No active session found.");
            // return;
        }
        let userProfile = await getUserProfile(session);
        console.log("MODE", (await supabase.from("userRecords").select("darkMode").eq("id", userProfile[0].id).single()).data["darkMode"]);
        if ((await supabase.from("userRecords").select("darkMode").eq("id", userProfile[0].id).single()).data["darkMode"]) {
            for (let i = 0; i < allElements.length; i++) {
                allElements[i].classList.add('darkMode');
            }
            let body = document.getElementsByTagName("body");
            console.log("Body", body[0]);
            if (document.getElementById("discordLogo") != null) {
                document.getElementById("discordLogo").src = "Images/discordWhite.png";
            }
            if (document.getElementById("editPencil") != null) {
                document.getElementById("editPencil").src = "Images/editPencilBlackBg.png";
            }
        }
    }else{
        console.log("Not there yet/error");
    }
    // body.classList.add('darkMode');
    //change discord logo to white
});

async function resize(){
   //need to make pfp move over too
        if(window.innerWidth < 500){
            if(document.getElementById("displayName") != null && document.getElementById("username") != null) {
                document.getElementById("displayName").remove();
                document.getElementById("username").remove();
            }
            if(document.getElementById("profileDiv") != null){
                document.getElementById("profileDiv").remove()
            }
        }else{
            if(document.getElementById("displayName") == null && document.getElementById("username") == null && document.getElementById("profileBtn") != null){
                let profileDiv = document.createElement("div");
                document.getElementById("profileBtn").appendChild(profileDiv);

                profileDiv.classList.add("vstack");
                profileDiv.id = "profileDiv";
                profileDiv.innerHTML = `
                 <h2 id="displayName" class="closeText" style="font-size: large; font-family: Lexend, sans-serif; font-weight: 600">TestName</h2>
                <h3 id="username" class="closeText" style="font-size: medium; font-family: Lexend, sans-serif; font-weight: 300">@testUser</h3>
                `
                 await updateData();
            }
        }
    if(document.getElementById("logos") != null && document.getElementById("discordLogo") != null){
            if(window.innerWidth < 670){
                document.getElementById("siteName").style.visibility = "hidden";
                document.getElementById("dateEst").style.visibility = "hidden";
            }else{
                document.getElementById("siteName").style.visibility = "visible";
                document.getElementById("dateEst").style.visibility = "visible";
            }
    }
    // let containers = document.getElementsByClassName('container');
    // let container = containers[0];
    // while(container.scrollHeight > container.offsetHeight){
    //     let images = container.querySelectorAll('img, input');
    //     for(let i = 0; i < images.length; i++){
    //         if(images[i].tagName.toLowerCase() === "input" ){
    //             if(images[i].type === "image"){
    //                 images.remove(i);
    //                 i--;
    //             }
    //         }
    //     }
    //     for(let i = 0; i < images.length; i++){
    //         images[i].style.height--;
    //         images[i].style.width--;
    //     }
    //     let texts = container.querySelectorAll('p, h1, h2, h3, h4, h5, textarea, input');
    //     for(let i = 0; i < texts.length; i++){}
    // }
}
let resizeTimeout2;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout2);
    resizeTimeout2 = setTimeout(() => {
        requestAnimationFrame(() => {
            resize(); // no await here
        });
    }, 200);
});

// window.addEventListener('beforeunload', async() => {
//     sessionStorage.clear();
//     await supabase.auth.signOut();
// })

// function sizing(){
//     document.getElementById("headerDiv").style.height = `${document.getElementById("page-title").offsetHeight + 10}`+'px';
//     if(window.innerWidth < 670){
//         document.getElementById("siteName").style.visibility = "hidden";
//         document.getElementById("dateEst").style.visibility = "hidden";
//     }else{
//         document.getElementById("siteName").style.visibility = "visible";
//         document.getElementById("dateEst").style.visibility = "visible";
//     }
// }
// window.addEventListener("resize", () =>{
//     sizing();
// });

//link elements
if(document.getElementById("discordLogo") != null){
    document.getElementById("discordLogo").addEventListener("click", async () => {
        window.open("https://discord.gg/yqt8kkEukA", '_blank').focus()
    })
}
if(document.getElementById("logos") != null){
    document.getElementById("logos").addEventListener("click", async () => {
        window.open("https://weather.com/", '_self').focus() //check default engine?
    })
}



//on screen pfp
if(document.getElementById("profile-pic-small") != null){
     updateData(); //supposed to be await but not allowed?
    // document.getElementById("profileBtn").addEventListener("click", async () => {
    //   await showMenu();
    // });
    // document.getElementById("profileBtn").addEventListener("mouseover", async () => {
    //     const hoverDiv = document.createElement("div");
    //
    // });

    let timeout;
    let hoverDiv;
    let state = {isLockedOpen: false}; // <--- NEW: tracks if menu is locked open
    let overlay = null; // We'll create it once and reuse it
    let isMenuReady = false;

    let proxy = new Proxy(state, {
        set(target, property, value) {
            if (property === "isLockedOpen") {
               // let allowedDiv = [document.getElementById("logos"), document.getElementById("hoverDiv"), document.getElementById("discordLogo")]; // CHANGE this to your div's id

                if (value === true) {
                    console.log("Locking everything except allowedDiv!");

                    // Create overlay if it doesn't exist
                    if (!overlay) {
                        overlay = document.createElement("div");
                        overlay.style.position = "fixed";
                        overlay.style.top = "0";
                        overlay.style.left = "0";
                        overlay.style.width = "100vw";
                        overlay.style.height = "85vh";
                        overlay.style.backgroundColor = "rgba(0, 0, 0, 0)"; // fully transparent
                        overlay.style.zIndex = "500"; // on top of everything
                        overlay.style.pointerEvents = "auto"; // it will block clicks
                        document.body.appendChild(overlay);
                    }

                    overlay.style.display = "block";

                    // Allow clicks through the allowed div
                    // if (allowedDiv) {
                    //     console.log("working on allowedDiv!");
                    //     for(let i = 0; i < allowedDiv.length; i++) {
                    //         allowedDiv[i].style.position = "relative"; // Make sure it can have z-index
                    //         allowedDiv[i].style.zIndex = "10000"; // Higher than the overlay
                    //     }
                    // }
                } else if (value === false) {
                    console.log("Unlocking everything!");

                    if (overlay) {
                        overlay.style.display = "none";
                    }

                    // if (allowedDiv) {
                    //     for(let i = 0; i < allowedDiv.length; i++){
                    //         allowedDiv[0].style.zIndex = ""; // Reset
                    //     }
                    // }
                }
            }

            target[property] = value;
            return true;
        }
    });

    // function getAllElementsWithClickListener() {
    //     const allElements = document.getElementsByTagName('*');
    //     const elementsWithListeners = [];
    //
    //     for (let i = 0; i < allElements.length; i++) {
    //         const element = allElements[i];
    //         const onclickAttribute = element.getAttribute('onclick');
    //         const directOnClick = typeof element.onclick === 'function'; // Better than hasOwnProperty
    //
    //         if (onclickAttribute || directOnClick) {
    //             elementsWithListeners.push(element);
    //         }
    //     }
    //
    //     return elementsWithListeners;
    // }

    // const elementsWithClickListener = getAllElementsWithClickListener();
    const showMenu = async () => {  //start 4/24
        if (!hoverDiv) {
            isMenuReady = false;
            //hoverDiv properties
            hoverDiv = await document.createElement("div");
            hoverDiv.id = "hoverDiv";
            hoverDiv.style.backgroundColor = "#8374a0";
            hoverDiv.style.color = "white";
            hoverDiv.style.height = "250px";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.borderRadius = "10px";
            hoverDiv.style.marginTop = "5px"
            hoverDiv.classList.add("vstack")
            hoverDiv.style.zIndex = "600";
            hoverDiv.style.border = "3px solid #000038";
            let session = await supabase.auth.getSession();
            if (!session) {
                console.log("No active session found.");
                // return;
            }
            let userProfile = await getUserProfile(session);
            if ((await supabase.from("userRecords").select("darkMode").eq("id", userProfile[0].id).single()).data["darkMode"]){
                hoverDiv.style.borderColor = "dimgray";
            }
            if(document.getElementById("profileBtn").offsetWidth > 150){
                hoverDiv.style.width = `${document.getElementById("profileBtn").offsetWidth}px` ;
            }else{
                hoverDiv.style.width = '150px';
            }

            // Position near the button
            const btn = document.getElementById("profileBtn");
            const rect = btn.getBoundingClientRect();
            if(btn.offsetWidth > 150){
                hoverDiv.style.left = `${rect.left + window.scrollX}px`;
            }else{
                hoverDiv.style.right = "0";
                hoverDiv.style.marginRight = "40px";
            }

            hoverDiv.style.top = `${rect.bottom + window.scrollY}px`;

            //inner html
            hoverDiv.innerHTML = `
            <button id="HomeBtn" style="width: 85%; background-color: #ffa697;">Home</button>
            <button id ="profileMenuBtn" style="width: 85%; background-color: #ffc494">View Profile</button>
            <button id="signoutBtn" style="width: 85%; background-color: #fee198 ">Sign out</button>
            <button id="settingsBtn" style="width: 85%; background-color: #83cea3 ">Settings</button>
            <button id="aboutBtn" style="width: 85%; background-color: #80a9cb">About us!</button>
         `;
            let buttons = hoverDiv.getElementsByTagName("button");
            console.log("Button", buttons)
            for(let i = 0; i < buttons.length; i++){ //finish 4/28
                let bgColor = buttons[i].style.backgroundColor;
                console.log("BgColor", bgColor);
                //convert rbg to hsl
                let red = bgColor.substring(bgColor.indexOf("(")+1, bgColor.indexOf(","));
                bgColor = bgColor.substring(bgColor.indexOf(",")+1);
                let green = bgColor.substring(0, bgColor.indexOf(","));
                bgColor = bgColor.substring(bgColor.indexOf(",")+1);
                let blue = bgColor.substring(0, bgColor.indexOf(")"));
                console.log(red,green,blue);
                let rprime = parseFloat(red)/255;
                let gprime = parseFloat(green)/255;
                let bprime = parseFloat(blue)/255;
                console.log(rprime, gprime, bprime);
                let cmax = Math.max(rprime, gprime, bprime);
                let cmin = Math.min(rprime, gprime, bprime);
                console.log(cmax, cmin);
                let delta = cmax - cmin;
                let h, s, l;
                if(delta === 0){
                    h = 0;
                }else if(cmax === rprime){
                    h = (60 * (((gprime-bprime)/delta)%6));
                }else if(cmax === gprime){
                    h = (60 * (((bprime-rprime)/delta) + 2));
                }else if(cmax === bprime){
                    h = (60 * (((rprime-gprime)/delta)+4));
                }else{
                    console.error("Error getting h value")
                }
                if(h !== null){
                    h = Math.floor(h);
                }
                l = Math.round(1000*((cmax+cmin)/2))/10;

                 if(delta === 0){
                     s = 0
                 }else{
                     s = Math.floor((delta/(1-Math.abs((2*(l/100))-1)))*100);
                 }
                 // s = (Math.round(10*s))/10
                 console.log(h,s,l);
                 buttons[i].addEventListener("mouseover", () => {
                     console.log("added for button", i)
                     buttons[i].style.setProperty( 'background-color', `hsl(${h},${3*s/4}%, ${3*l/4}%)`);
                 });
                 buttons[i].addEventListener("mouseout", () => {
                     console.log("out added for button", i)
                     buttons[i].style.setProperty('background-color', `hsl(${h},${s}%, ${l}%)`);
                 })


                isMenuReady = true
            }
            // document.getElementById("HomeBtn").addEventListener("mouseover", () =>{
            //     document.getElementById("HomeBtn").style.backgroundColor = "#cc8277";
            // });
           // relinkStylesheet();

            // Mouse listeners for hover-stay
            hoverDiv.addEventListener("mouseenter", () => clearTimeout(timeout));
            hoverDiv.addEventListener("mouseleave", async () => {
                if(!proxy.isLockedOpen){
                    console.log("check")
                    await hideMenu();
                }
            });

            document.body.appendChild(hoverDiv);

            //button clicks
            // let session = await getSession();
            // console.log("Session",session);
            // let userProfile = await getUserProfile(session);
            console.log("Profile?",userProfile);
            await clickBtn("HomeBtn", "Home.html");
            await clickBtn("profileMenuBtn", "Profile.html?path=/"+userProfile[0].id);
            await clickBtn("signoutBtn", "Startup.html");
            // await clickBtn("signoutBtn");
            await clickBtn("settingsBtn", "settings.html");
            await clickBtn("aboutBtn", "About.html");

        }
    };

    const hideMenu = async() => {
        const waitUntilReady = setInterval(() => {
            if (isMenuReady) {
                clearInterval(waitUntilReady);
                timeout = setTimeout(() => {
                    if (hoverDiv && !proxy.isLockedOpen) {
                        hoverDiv.remove();
                        hoverDiv = null;
                        isMenuReady = false;
                    }
                }, 100);
            }
        }, 25); // check every 10ms
    };


    const btn = document.getElementById("profileBtn");
    btn.addEventListener("mouseenter", async () => {
        if(!proxy.isLockedOpen) await showMenu();
    });
    btn.addEventListener("mouseleave", async() => {
        if (!proxy.isLockedOpen) {
            timeout = setTimeout(async() => {
                if (!hoverDiv.matches(':hover')) {
                    await hideMenu();
                }
            }, 100); // slightly longer than the time needed to move cursor
        }
    });

    const toggleMenuLock = async () => {
        if (!hoverDiv) {
            await showMenu();
            proxy.isLockedOpen = true; // <--- Lock open after showing
        } else if (proxy.isLockedOpen) {
            hoverDiv.remove();
            hoverDiv = null;
            proxy.isLockedOpen = false; // <--- Unlock when clicked again
        } else {
            proxy.isLockedOpen = true; // <--- Lock it if it was open by hover
        }
    };

    btn.addEventListener("click", toggleMenuLock);
    document.addEventListener("click", (event) => {
        const btn = document.getElementById("profileBtn");
        if (
            hoverDiv && proxy.isLockedOpen &&
            !hoverDiv.contains(event.target) &&
            !btn.contains(event.target)
        ) {
            hoverDiv.remove();
            hoverDiv = null;
            proxy.isLockedOpen = false;
        }
    });

}

async function clickBtn(buttonId, destination){
    console.log("Button id", buttonId);
        console.log("clicked");
        if(document.getElementById(buttonId) != null && document.getElementById(buttonId) !== undefined) {
            document.getElementById(buttonId).addEventListener("click", async () => {
                if (buttonId === "signoutBtn") {
                    console.log("signing out");
                    await signOut();
                }
                window.location.href = destination;

            })
        } else{
            document.addEventListener("DOMContentLoaded", async () => {
                await clickBtn(buttonId, destination);
            })
        }
    }



 async function updateData(){

    console.log("running:", await supabase.auth.getSession());
    console.log(supabase);
    const session = await supabase.auth.getSession();
    if (!session) {
        console.log("No active session found.");
        // return;
    }

    let userProfile = await getUserProfile(session);
    const timestamp = new Date().getTime(); // Unique value
     document.getElementById("profile-pic-small").src = userProfile[0].pfp + `?t=${timestamp}`;
     if(document.getElementById("displayName") != null && document.getElementById("username") != null) {
         document.getElementById("displayName").textContent = userProfile[0].displayName;
         document.getElementById("username").textContent = "@" + userProfile[0].username;
     }
}



async function formatTimestamp(timestamp) {
    console.log("timestamp", timestamp);
    const timeData = {};
    let timezoneOffset= parseFloat((new Date()).getTimezoneOffset());
    console.log('timezone',timezoneOffset);
    timeData.year = parseFloat(timestamp.substring(0, 4));
    timeData.month = parseFloat(timestamp.substring(5,7));
    timeData.day = parseFloat(timestamp.substring(8, 10));
    timeData.hour = parseFloat(timestamp.substring(11, 13));
    timeData.minute = parseFloat(timestamp.substring(14, 16));

    let numDaysInMonth = daysInMonth(timeData.month, timeData.year);

    if(timezoneOffset%60 !== 0){
        timeData.minute -= timezoneOffset%60;
        if(timeData.minute < 0){
            timeData.minute += 60;
            timeData.hour -= 1;
        }
        if(timeData.minute >= 60){
            timeData.minute -= 60;
            timeData.hour += 1;
        }
    }
    if(timeData.minute <10){
        timeData.minute = "0" + timeData.minute;
    }
    timezoneOffset = Math.trunc(timezoneOffset/60);
    // if(timezoneOffset < 0){
    //     //edit hour correctly??? timezoneOffset-- or timezoneOffset++
    // }
    timeData.hour -= timezoneOffset;
    if(timeData.hour < 0){
        timeData.hour += 24;
        timeData.day--;
    }
    if(timeData.hour >= 24){
        timeData.hour -=24;
        timeData.day++;
    }
    if(timeData.day > numDaysInMonth){
        timeData.day = 1;
        timeData.month++;
    }
    if(timeData.day<1){
        timeData.day = daysInMonth(timeData.month - 1, timeData.year);
        timeData.month--;
    }
    if(timeData.month<1){
        timeData.month = 12
        timeData.year--;
    }
    if(timeData.month>12){
        timeData.month = 1
        timeData.year++;
    }
    timeData.dayOfWeek = ZellersCongruence(timeData.day, timeData.month, timeData.year);
     let q = timeData.day;

    let dayStr;
    console.log("q",q);
    if(q%10===1){
        if(Math.floor(q/10) ===1){
            dayStr = q+"th";
        }else{
            dayStr = q+"st";
        }
    }else if(q%10===2){
        if(Math.floor(q/10) ===1){
            dayStr = q+"th";
        }else{
            dayStr = q+"nd";
        }
    }else if(q%10===3){
        dayStr = q+"rd";
    }else {
        dayStr = q + "th";
    }

        timeData.day = dayStr;

    if(timeData.hour === 0 ||timeData.hour === 24){
        timeData.twelveHour = 12;
        timeData.am = "AM";
    } else if(timeData.hour > 12){
        timeData.twelveHour = timeData.hour - 12;
        timeData.am = "PM";
    } else if(timeData.hour === 12){
        timeData.twelveHour = 12;
        timeData.am = "PM";
    } else{
        timeData.twelveHour = timeData.hour;
        timeData.am = "AM"
    }

    let m = timeData.month;
    let monthStr;
    if(m === 1)
        monthStr = "January";
    else if(m === 2)
        monthStr = "February";
    else if(m === 3)
        monthStr = "March";
    else if(m === 4)
        monthStr = "April";
    else if(m === 5)
        monthStr = "May";
    else if(m === 6)
        monthStr = "June";
    else if(m === 7)
        monthStr = "July";
    else if(m === 8)
        monthStr = "August";
    else if(m === 9)
        monthStr = "September";
    else if(m === 10)
        monthStr = "October";
    else if(m === 11)
        monthStr = "November";
    else
        monthStr = "December";

    timeData.monthStr = monthStr;

    return timeData;
}

 function daysInMonth(month, year){
    if(month === 2 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        return 29;
    else if(month===2)
        return 28;
    else if(month === 4 || month === 6 || month === 9 || month ===11)
        return 30;
    else
        return 31;
}

 function ZellersCongruence(day, month, year){
    console.log(day,month,year);
    let m;
    if(month === 1){
        m = 13;
    }else if(month === 2){
        m = 14;
    }else{
        m = month;
    }
    let y = year;
    if (m === 13 || m === 14)
        y--;
    let K = year % 100;
    let J = Math.floor(year / 100);
    let h = (day + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + 5 - J ) % 7;
    console.log("h",h);
    if (h === 0) {
        return "Sunday";
    } else if (h === 1) {
        return "Monday";
    } else if (h === 2) {
        return "Tuesday";
    } else if (h === 3) {
        return "Wednesday";
    } else if (h === 4) {
        return "Thursday";
    } else if (h === 5) {
        return "Friday";
    } else {
        return "Saturday";
    }
}

function getVisualLineCount(textarea, paramater) { //Won't shrink for some reason?
//     // const style = window.getComputedStyle(textarea);
//     // console.log('Style',style)
//     // const lineHeight = parseFloat(textarea.style.lineHeight);
//     // console.log('lineheight',lineHeight);
//     // const height = textarea.scrollHeight;
//     // console.log('height',height);
//     // const nonEmptyLines = textarea.value.split('\n').filter(line => line.trim() !== '');
//     // console.log("Non-empty lines", nonEmptyLines);
//     // let numLines = Math.floor(height/lineHeight);
//     // for (let i = 0; i < numLines; i++) {
//
//         let text = textarea.value;
//         let charArray = [];
//         let length = textarea.value.length;
//         for (let j = 0; j < length; j++) {
//             charArray.push(text.substring(0,1));
//             text = text.substring(1);
//         }
//         let k = 0;
//         let done = false;
//         let lines = [];
//         while(!done) {
//             let endOfLine = false;
//             let testText = document.createElement('span');
//             testText.style.visibility = "hidden";
//             testText.style.width = textarea.style.width;
//             testText.textContent = "";
//             while (!endOfLine) {
//                 if (k >= charArray.length) {
//                     endOfLine = true;
//                 }else{
//                     testText.textContent += charArray[k];
//                     while(testText.clientWidth < testText.scrollWidth) {
//                         endOfLine = true;
//                         testText.substring(0,testText.textContent.length -2);
//                         k--;
//                     }
//                     if(endOfLine && testText.textContent.indexOf(" ") !== -1) {
//                         let additionalText = testText.textContent.substring(testText.textContent.lastIndexOf(" ")+1);
//                         testText.textContent = testText.textContent.substring(0, testText.textContent.lastIndexOf(" ") - 1);
//                         k -= additionalText.length;
//                     }
//                 }
//             }
//             lines.push(testText.textContent);
//             if(k >= charArray.length) {
//                 done = true;
//             }
//         }
//         console.log(lines);
// //
//     //
//     //
//     //     need full line
//     // }
//     let lastChar = textarea.value.substring(textarea.value.length-1);
//     console.log("LAST CHAR",lastChar);
//
//    return lines.length;
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(style.lineHeight);
    // const style = window.getComputedStyle(textarea);
    const height = textarea.scrollHeight;
    console.log('height',height);
    let numLines = Math.floor(height/lineHeight);
    if (!lineHeight || isNaN(lineHeight)) {
        console.warn("Could not determine line height");
        return 0;
    }
    console.log("numLines", numLines);
// if(numLines>= paramater) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordBreak = 'break-word';
    div.style.boxSizing = style.boxSizing;
    div.style.padding = style.padding;
    div.style.width = style.width;
    div.style.font = style.font;
    div.style.lineHeight = style.lineHeight;
    div.style.letterSpacing = style.letterSpacing;
    div.style.border = style.border;

    document.body.appendChild(div);

    let totalLines = 0;
    // const rawLines = textarea.value.split('\n');

    const rawLines = textarea.value.split('\n');

// Don't trim user-entered blank lines — keep all input lines.
    const lines = rawLines;

// But after counting, trim wrapped lines that are just visual overflow (empty-looking).
    let lastNonWhitespaceIndex = lines.length - 1;
    while (lastNonWhitespaceIndex >= 0 && lines[lastNonWhitespaceIndex].trim() === '') {
        lastNonWhitespaceIndex--;
    }
    const visibleLineCount = lines.reduce((acc, line, index) => {
        div.textContent = line || ' ';
        const height = div.scrollHeight;
        const wrappedLines = Math.round(height / lineHeight);

        // Keep all wrapped lines if they were entered by the user (even blank ones)
        // But trim trailing visual-only wrapped lines beyond last meaningful content
        if (index > lastNonWhitespaceIndex && line.trim() === '') {
            return acc; // skip trailing blank lines
        }

        return acc + wrappedLines;
    }, 0);


    lines.forEach(line => {
        div.textContent = line || ' '; // Ensure even empty lines take up space
        const height = div.scrollHeight;
        const linesInBlock = Math.round(height / lineHeight);
        totalLines += linesInBlock;
    })

    document.body.removeChild(div);
    return totalLines;
// }else{
//     return numLines;
// }
}



 function goToProfile(userId){
    window.location.href = "Profile.html?path=/"+userId;
}

async function signOut() { //start 4/25
    try {
        console.log("Signing out with global scope...");

        // Call Supabase signOut
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) {
            console.error("Supabase signOut error:", error.message);
        }

        // Manual clean-up
        console.log("Clearing sessionStorage/localStorage...");
        sessionStorage.clear();
        localStorage.clear();

        console.log("Clearing all accessible cookies...");
        // Remove cookies (except HttpOnly)
        document.cookie.split(";").forEach((cookie) => {
            console.log(cookie)
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Check session immediately after logout
        const { data } = await supabase.auth.getSession();
        console.log("Session after full cleanup:", data.session); // Should be null

        // Optional: Force reload to ensure all session proxy is reset
        location.reload(); // optional, but forces a memory reset

    } catch (e) {
        console.error("Force sign-out failed:", e);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        console.log('Escape key pressed!');
        window.open("https://weather.com/", '_self').focus();
    }
});

function purifyUserInput(userInput){
    const badHtml = ["<form","<input","<textarea","<button","<select","<optgroup","<option", "<label","<fieldset", "<legend","<output","<datalist","<frame", "<frameset", "<noframes", "<iframe", "<img", "<map", "<area", "<canvas", "<figcaption", "<figure","<picture","<svg","<audio","<video","<source","<track","<a","<nav", "<link", "<table","<caption","<th", "<td", "<tr","<thead", "<tbody","<tfoot","<col","<colgroup","<style","<div","<span", "<header","<hgroup","<footer","<main","<section","<search","<details","<dialog","<data","<summary","<head", "<meta", "<base","<basefront", "<script", "<noscript","<applet","<embed","<object","<param"]
    if(badHtml.some(substring => userInput.includes(substring))) {
        console.warn("Potentially malicious html code found in", userInput);
        return "removed"
    }else{
        return userInput;
    }
}
