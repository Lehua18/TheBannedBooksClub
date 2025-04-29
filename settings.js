window.onload = async() => {

    document.getElementById("saveMsg").visibility = false;

    //get profile stuff
    const session = await getSession();
    if (!session) {
        console.log("No active session found.");
        // return;
    }
    let userProfile = await getUserProfile(session);

    if (!userProfile || userProfile.length === 0) {
        console.log('No user profile found.');
    }
    console.log('User profile:', userProfile);

    // const memberId = userProfile[0].id;
    // if(memberId === userProfile.data[0].id) {
    const profileMember = await supabase.from("userRecords").select('*').eq('id', userProfile[0].id);
    // }else{
    //     const profileMember = userProfile;
    // }

    document.getElementById("editPencil").style.visibility = "visible";
    document.getElementById("profileBtn").style.visibility = "visible";
    console.log("Profile Member:", profileMember);
    document.getElementById("displayNameMember").textContent = profileMember.data[0].displayName;
    document.getElementById("usernameMember").textContent = '@'+profileMember.data[0].username;
    console.log("Created at", profileMember.data[0].created_at)
    let dateInfo = await formatTimestamp(profileMember.data[0].created_at);
    document.getElementById("dateJoined").textContent = "Joined "+dateInfo.monthStr + " " +dateInfo.day +", "+dateInfo.year;

    const timestamp = new Date().getTime(); // Unique value
    document.getElementById("profile-pic").src = profileMember.data[0].pfp + `?t=${timestamp}`;
    // console.log("dark mode", userProfile[0].darkMode)
    if(userProfile[0].darkMode){
        document.getElementById("darkModeSlider").checked = true;
        document.getElementById("darkModeOnOff").textContent = "On";
    }else{
        document.getElementById("darkModeSlider").checked = false;
        document.getElementById("darkModeOnOff").textContent = "Off";
    }
}
    document.getElementById('editPencil').addEventListener('click', async() => {
    window.location.href = "EditProfile.html";
    });
document.getElementById("darkModeSlider").addEventListener("change", () =>{
    if(document.getElementById("darkModeSlider").checked){
        document.getElementById("darkModeOnOff").textContent = "On";
    }else{
        document.getElementById("darkModeOnOff").textContent = "Off";
    }
    document.getElementById("saveMsg").style.visibility = "visible";

});

document.getElementById("submitSettings").addEventListener("click", async() => {
    const session = await getSession();
    if (!session) {
        console.log("No active session found.");
        // return;
    }
    let userProfile = await getUserProfile(session);

    if (!userProfile || userProfile.length === 0) {
        console.log('No user profile found.');
    }
    console.log('User profile:', userProfile);
    let userId = userProfile[0].id;
    if(userId){
        // Perform the update without relying on .select() for now
        console.log('About to UPDATE');
        const jsonSettingsObject = {
           darkMode: document.getElementById("darkModeSlider").checked,
        };

// Converting to a JSON string if needed
        const jsonString = JSON.stringify(jsonSettingsObject);
        console.log(jsonString);
        console.log(jsonSettingsObject);
        console.log( 'Update', await supabase
            .from('userRecords')
            .update(jsonSettingsObject)
            .eq('id', userId));

        const {error} = await supabase
            .from('userRecords')
            .update(jsonSettingsObject)
            .eq('id', userId);

    }
    let pageBack = JSON.parse(sessionStorage.getItem("pageBack"))
    console.log("History",pageBack);
    window.location.href = pageBack[pageBack.length - 2];
})

