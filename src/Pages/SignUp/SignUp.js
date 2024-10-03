import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../DataContext/DataContext";
import bacolalogo from "../../ImageAssets/bacolalogo.png";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import googleimg from "../../ImageAssets/googleimg.PNG";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { postData } from "../../utils/api";
import { toast } from "react-hot-toast";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
const SignUp = () => {
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const { setHeaderFooterShow } = useContext(DataContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [registerFormFields, setRegisterFormFields] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
  });
  const changeInputFields = (e) => {
    setRegisterFormFields(() => ({
      ...registerFormFields,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const registerAdminPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/user/signup", registerFormFields);
        console.log(response);

        if (response.success) {
          resolve();
          setRegisterFormFields({
            name: "",
            email: "",
            password: "",
            phone: "",
            isAdmin: false,
          });

          navigate("/signin");
        } else {
          reject(new Error(response.error || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(registerAdminPromise, {
      loading: "User is being Created..",
      success: "User Created Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // eslint-disable-next-line
      const token = credential.accessToken;

      const user = result.user;

      const fields = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        password: null,
        image: user.providerData[0].photoURL,
        phone: user.providerData[0].phoneNumber,
      };
      const loginPromiseWithGoogle = new Promise(async (resolve, reject) => {
        try {
          const response = await postData("/api/user/authWithGoogle", fields);
          if (response.success) {
            localStorage.setItem("token", response.token);
            const user = {
              name: response?.user?.name,
              email: response?.user?.email,
              userId: response?.user?._id,
            };
            localStorage.setItem("user", JSON.stringify(user));
            resolve();
            window.location.href = "/";
          } else {
            reject(new Error(response.error || "An error occurred")); // Reject the promise on failure
          }
        } catch (error) {
          console.log(error);
          reject();
        }
      });

      toast.promise(loginPromiseWithGoogle, {
        loading: "Logging in User..",
        success: "User Logged In Successfully",
        error: (err) => `${err?.message || "An unexpected error occurred"}`,
      });
    });
  };
  useEffect(() => {
    setHeaderFooterShow(false);
  }, [setHeaderFooterShow]);
  const handleCancel = () => {
    setHeaderFooterShow(true);
    navigate("/");
  };
  return (
    <section className="section signInPage ">
      <div className="container">
        <div className="imgWrapper  ">
          <img src={bacolalogo} alt="logo" />
        </div>
        <div className=" box card p-3 shadow border-0 mt-4">
          <Typography
            variant="h6"
            textTransform={"capitalize"}
            fontWeight={600}
            sx={{ padding: "10px 30px", color: "blue" }}
          >
            Sign up
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="d-flex align-items-center mb-2">
                <TextField
                  type="text"
                  label="Full Name"
                  required
                  variant="filled"
                  className=""
                  name="name"
                  onChange={changeInputFields}
                />
                <TextField
                  type="number"
                  label="Contact No"
                  required
                  variant="filled"
                  className="ml-3"
                  name="phone"
                  onChange={changeInputFields}
                />
              </div>
              <TextField
                type="email"
                label="Email"
                required
                variant="filled"
                className="w-100 mb-2"
                name="email"
                onChange={changeInputFields}
              />
              <TextField
                type={passwordVisible ? "text" : "password"}
                label="Password"
                required
                variant="filled"
                className="w-100"
                name="password"
                onChange={changeInputFields}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {passwordVisible ? (
                        <VisibilityOffIcon
                          onClick={() => setPasswordVisible(false)}
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={() => setPasswordVisible(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="d-flex align-items-center row">
              <Button variant="contained" className="col" type="submit">
                Create Account
              </Button>
              <Button
                variant="contained"
                color="error"
                className="col ml-3"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>

            <p className="mt-3">
              Already Registered?{" "}
              <Link className="border-effect" to={"/signin"}>
                Login
              </Link>{" "}
            </p>

            <Typography variant="body1" textAlign={"center"} fontWeight={600}>
              Or
            </Typography>
            <Button className="" onClick={signInWithGoogle}>
              <img src={googleimg} alt="" className="w-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
