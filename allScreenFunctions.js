//discord, back btn, quick exit
//     const {createClient} = window.supabase;
//     const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
//     const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
//     const supabase = createClient(supabaseURL, supabaseAnonKey);
window.addEventListener( "DOMContentLoaded", function() { //Might not work if user gets link from other website (cookies?)
    console.log("Window history:", window.history)
    console.log("document referrer", document.referrer)
    if(window.history.length === 1) {
        alert("Press the logo at the bottom of the screen to exit immediately.")
    }
});

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

if(document.getElementById("discordLogo") != null){
    document.getElementById("discordLogo").addEventListener("click", async () => {
        window.open("https://discord.gg/yqt8kkEukA", '_blank').focus()
    })
}

if(document.getElementById("logos") != null){
    document.getElementById("logos").addEventListener("click", async () => {
        window.open("https://www.google.com/", '_self').focus() //check default engine?
    })
}

if(document.getElementById("backBtn") != null) {

    if (((!document.referrer.includes("Signup") && !document.referrer.includes("Login")) || (window.location.href.includes("Signup") || window.location.href.includes("Login"))) && !document.referrer.includes("EditProfile")) { //window.history? (gets referrer, which may not be actual last page)
        document.getElementById("backBtn").addEventListener("click", async () => {
            window.history.back();
        })
    }else if(!document.referrer.includes("EditPost")) {
        window.location.href //fix
}else{
        document.getElementById("backBtn").addEventListener("click", async () => {
            window.location.href = 'Home.html';
        })
    }
    if((localStorage.getItem('postId') != null) /**&& () is document.refferer != post? */){
        localStorage.removeItem('postId');
    }
}
if(document.getElementById("profile-pic-small") != null){
    updateData();
    document.getElementById("profileBtn").addEventListener("click", async () => {
        window.location.href = "Profile.html";
    })
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
     document.getElementById("displayName").textContent = userProfile[0].displayName;
     document.getElementById("username").textContent = "@" + userProfile[0].username;
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