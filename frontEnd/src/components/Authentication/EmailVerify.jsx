import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch } from "react-redux";
import { logOut } from "../../store/slices/userSlice";
import { clearChat } from "../../store/slices/chatSlice";
import { clearTheme } from "../../store/slices/themeSlice";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const param = useParams();

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("themeColor");
    dispatch(clearChat());
    dispatch(clearTheme());
  };

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `https://megatalkbackend.onrender.com/api/user/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        handleLogOut();
        // console.log(data);
        setValidUrl(true);
      } catch (error) {
        // console.log(error);

        setValidUrl(false);
      } finally {
        setLoading(false);
      }
    };
    verifyEmailUrl();
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {validUrl ? (
        <div className="min-h-screen w-full bg-[#77d177] text-white flex flex-col justify-center items-center">
          {/* <img src={success} alt="success_img" className={styles.success_img} /> */}
          <CheckCircleIcon style={{ fontSize: "48px" }} />
          <p className="text-[50px]">SUCCESS</p>
          <h1 className="text-3xl font-semibold my-5 mb-10">
            Email verified successfully
          </h1>
          <Link to="/">
            <button className="w-40 py-1 border-[2px] border-white text-white hover:text-white hover:border-transparent hover:bg-red-400">
              LOGIN
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-3xl min-h-screen w-full bg-[#ea5d5d] text-white flex  justify-center items-center">
          {" "}
          404 Not Found
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
