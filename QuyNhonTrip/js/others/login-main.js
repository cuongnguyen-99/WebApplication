function sign_up() {
  if (document.getElementById("password_signup").value.length <= 7) {
      $.notify({
          title: '<strong>Warning!</strong>',
          message: 'Password must have a minimum length of 8.'
      }, {
              type: 'warning',
              z_index: 2000,
          });

          
    return;
  }

  if (
    document.getElementById("password_signup").value == document.getElementById("re_pass").value
  ) {
    fetch("/people/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("email_signup").value,
        username: document.getElementById("username_signup").value,
        password: document.getElementById("password_signup").value,
        forename: document.getElementById("forename").value,
        surname: document.getElementById("surname").value,
        access_token: "concertina"
      })
    })
      .then(res => {
        res.json().then(data => {
          if (res.status == 403) {
            window.alert("Error! Invalid or missing access token.");
            return;
          }

          if (res.status == 409) {
              $.notify({
                  title: '<strong>Error!</strong>',
                  message: 'Username or Email already exists.'
              }, {
                      type: 'danger',
                      z_index: 2000,
                  });

            return;
          }

          if (res.staus == 500) {
              $.notify({
                  title: '<strong>Error!</strong>',
                  message: 'Unable to create account. (Invalid Email?)'
              }, {
                      type: 'danger',
                      z_index: 2000,
                  });
            return;
          }

          if (res.status == 201) {
            window.location.href = "login.html";
            var input_forename = document.getElementById("forename").value.toLowerCase();
            input_forename = input_forename.charAt(0).toUpperCase() + input_forename.slice(1);

              $.notify({
                  title: '<strong>Success!</strong>',
                  message: "Welcome to Canvas " + input_forename
              }, {
                      type: 'success',
                      z_index: 2000,
                  });

          }
        });
      })
      .catch(err => {
        console.log(err);
        console.log("signup failed!");
      });
  } else {
      $.notify({
          title: '<strong>Warning!</strong>',
          message: 'Passwords do not match'
      }, {
              type: 'warning',
              z_index: 2000,
          });
  }
}

function login() {
  if (
    document.getElementById("inputEmail").value == "" ||
    document.getElementById("inputPassword").value == ""
  ) {
      $.notify({
          title: '<strong>Error!</strong>',
          message: 'Login details cannot be blank!'
      }, {
              type: 'warning',
              z_index: 2000,
          });
  } else {
    let input_email = document.getElementById("inputEmail").value;
    input_email = input_email.toLowerCase();

    fetch("/people/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: document
          .getElementById("inputEmail")
          .value.toLowerCase()
          .trim(),
        password: document.getElementById("inputPassword").value,
        access_token: "concertina"
      })
    })
      .then(res => {
        res.json().then(data => {
          if (res.status == 403) {
            window.alert("Error! Invalid or missing access token.");
            return;
          }

          if (res.status == 200) {
            localStorage.clear();
            localStorage.setItem("access_token", data.token);
            localStorage.setItem("_id", data._id);
            localStorage.setItem("name", data.forename);

            window.location.href = "poems.html";
          }

          if (res.status == 401){
            console.log('failed!')
            $.notify({
              title: '<strong>Oops!</strong>',
              message: 'Incorrect Email or Password!'
            }, {
                type: 'warning',
                z_index: 2000,
              });
          }

        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}
