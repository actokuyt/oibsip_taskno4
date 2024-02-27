const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginSubmit");
loginSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  let payload = {
    username: loginUsername.value,
    password: loginPassword.value,
  };

  try {
    let response = await axios.post("https://infobyte-auth.onrender.com/login", payload);
    if (response.status == 200) {
      loginUsername.value = "";
      loginPassword.value = "";
      document.body.innerHTML = response.data;
    }
  } catch (error) {
    if (error.response.status == 404) {
      Swal.fire({
        text: "Username not Found",
        footer: '<a href="/signup">signup?</a>',
      });
    }
    else if ( error.response.status == 403) {
      Swal.fire({
        text: "Wrong Password Entered",
      });
    }
  }
});
