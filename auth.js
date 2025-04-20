//initialize supabase
//import { createClient } from '@supabase/supabase-js'
const{createClient} = window.supabase;
const supabaseURL="https://kjwtprjrlzyvthlfbgrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
const supabase = createClient(supabaseURL, supabaseAnonKey);
//Login
const loginBtn=document.getElementById("login-btn")
loginBtn?.addEventListener("click",async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        //  let account;
        //try {
        const {data, error} = await supabase.auth.signInWithPassword({email: email, password: password});
        //  } catch (e) {
        if (error) {
            document.getElementById("error-msg").textContent = error.message;
        }

        //const data = await supabase.auth.signInWithPassword({email: email, password: password});
//console.log(data);
        let error2 = false
        try {
            const {data,error} = await supabase.auth.signInWithPassword({email: email, password: password});


            if (!data) {
                document.getElementById("error-msg").textContent = "Account not found";
            }else if(!error){
                window.location.href = 'Home.html';
            }
            // } else {
            //
            //     // if(error){
            //     //     document.getElementById("error-msg").textContent = error.message;
            //     //
            //     // }else {
            //     window.location.href = 'display.html';
            //     //   }
            // }
        }catch (e){
            document.getElementById("error-msg").textContent = e.message;

        }
// if(!error2){
//     window.location.href = 'display.html';
    }
);
//Signup
const signupBtn=document.getElementById("signup-btn");
signupBtn?.addEventListener("click",async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    const displayName = document.getElementById("display-name").value;
    console.log(email, password, username, displayName);
    if (email === "" || displayName === "" || username === "" || password === "") {
        document.getElementById("error-msg").textContent = "Please fill out all fields."
    }else if(!email.includes('@') || !email.includes('.')) {
        document.getElementById("error-msg").textContent = "Please enter a valid email address."
    }else if(await checkForDuplicates("username", username)) {
        document.getElementById("error-msg").textContent = "This username already exists. Please choose a different one.";
    }else if(await checkForDuplicates("displayName", displayName)) {
        document.getElementById("error-msg").textContent = "This display name already exists. Please choose a different one.";
    }else{
        //MUST CHECK FOR DUPLICATES PRIOR TO SIGNUP
    const{error: signupError, user} = await supabase.auth.signUp({email, password});
    //console.log(user);
    if(signupError){
        console.log("Error",signupError)
        document.getElementById("error-msg").textContent = signupError.message;


    } else {
        const{error: insertError} = await supabase.from('userRecords').insert([{
           email: email, username: username, displayName: displayName
        }]);


        if(insertError){
            console.log("insert Error",insertError)
            // if(insertError.code === "23505"){
                // document.getElementById("error-msg").textContent = "Your username or display name already exists!";
            // }else {
                document.getElementById("error-msg").textContent = insertError.message+". Please contact the website owner to complete sign up.";
            // }
        }else{
            window.location.href = 'EditProfile.html';
        }
    }

    //  const{error, user} = await supabase.auth.signUp(email, password);
    try {
        const user2 /*{error, user}*/ = await supabase.auth.signUp({email: email, password: password});
    }catch (e) {
        document.getElementById("error-msg").textContent = e.message;
    }
    const user2 /*{error, user}*/ = await supabase.auth.signUp({email: email, password: password});
    if(!user2){
        document.getElementById("error-msg").textContent = "User and error are both null";
    }else {
        if (user) {
            await supabase.from('profiles').insert([{
                username: username, displayName: displayName, email: email, UID: user.id
            }]);
            window.location.href = 'EditProfile.html';
        } else {
            //  document.getElementById("error-msg").textContent = "There was an error";
        }
    }


    }
});
if(document.getElementById("go-to-login-btn") != null) {
    document.getElementById("go-to-login-btn").addEventListener("click", async () => {
        window.location.href = 'Login.html';
    });
}
if(document.getElementById("go-to-signup-btn") != null) {
    document.getElementById("go-to-signup-btn").addEventListener("click", async () => {
        console.log("Go to Signup");
        window.location.href = 'Signup.html';
    });
}

async function checkForDuplicates(columnName, enteredValue){
    let column = await supabase.from("userRecords").select(columnName);
    console.log("column",column.data);
    let isDuplicate = false;

    for(let i=0; i<column.data.length; i++){
        if(column.data[i][columnName] === enteredValue){
            isDuplicate = true;
        }
    }
    return isDuplicate;
}

//