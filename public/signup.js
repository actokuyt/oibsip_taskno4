const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupSubmit = document.getElementById("signupSubmit");
signupSubmit.addEventListener("click", async (e)=>{
  e.preventDefault();

  let payload = {
      username:signupUsername.value,
      password:signupPassword.value
  }

  try {
      const response = await axios.post("https://infobyte-auth.onrender.com/signup", payload);
      if (response.status == 200){
          signupUsername.value = "";
          signupPassword.value = "";
          Swal.fire({
            text: "Signup Successful!",
            footer: '<a href="/">Login?</a>',
          });
      }
  } catch (error) {
      Swal.fire({
        text: "User Name Already Exists",
        footer: '<a href="/">Try Login?</a>',
      });
  }

});

