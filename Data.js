//fetch and display user data
// const{createClient} = window.supabase;
// const supabaseURL="https://kjwtprjrlzyvthlfbgrq.supabase.co";
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
// supabase = createClient(supabaseURL, supabaseAnonKey);
const profileDataDiv = document.getElementById('profile-data');

let session = null

async function getSession(){
    session = await  supabase.auth.getSession();
    return session;
}

//call the async function
getSession().then(session =>{
    console.log(session);
}).catch(error => {
    console.log('Error fetching session', error);
});

async function getUserProfile(session){
    const userId = session.data.session.user.id;
    const {data: userProfile, error} = await supabase.from('userRecords').select('*').eq('id', userId);
    if(error){
        console.log('Error fetching user data:',error);
        return null;
    }
    return userProfile;
}

async function fetchProfile(){
    const sessions = await supabase.auth.getSession();
    const userProfile = await getUserProfile(sessions);
    if(userProfile){
        console.log('User profile:',userProfile);
        // profileDataDiv.innerHTML =
        //     `<p><strong>Display Name: </strong> ${userProfile[0].displayName}</p>`+
        //     `<p><strong>Username: </strong> ${userProfile[0].username}</p>`+
        //     `<p><strong>Email: </strong> ${userProfile[0].email}</p>`+
        //     `<p><strong>Bio: </strong> ${userProfile[0].bio}</p>`;
        //     `<p><strong>Pronouns: </strong> ${userProfile[0].pronouns}</p>`;
        //     `<p><strong>Pfp: </strong> ${userProfile[0].pfp}</p>`;

    }
}
fetchProfile().catch((error) =>{
    console.log('Error:', error);
})