import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import success from "../../images/success.png";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:5000/api/user/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <>
      {validUrl ? (
        <div className="">
          {/* <img src={success} alt="success_img" className={styles.success_img} /> */}
          <p className="text-[50px]">SUCCESS</p>
          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button className="">Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </>
  );
};

export default EmailVerify;
