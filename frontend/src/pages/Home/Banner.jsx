import banner from "../../assets/images/logo.png";
import useAuthStore from "../../stores/authStore";
import useLoginModalStore from "../../stores/loginModalStore";
import useRegisterModalStore from "../../stores/registerModalStore";

export default function Banner() {
  const handleLoginModal = useLoginModalStore(
    (state) => state.handleLoginModal
  );
  const handleRegisterModal = useRegisterModalStore(
    (state) => state.handleRegisterModal
  );

  const { user } = useAuthStore();

  return (
    <div className="section__container header__container">
      <div className="header__content z-30">
        <h4 className="uppercase">Welcome To</h4>
        <h1>Gladex Loyalty Membership</h1>
        <h3>Travel beyond limits with Gladex Membership!</h3>
        {!user && (
          <div className="flex gap-2 mt-2">
            <button onClick={handleLoginModal} className="btn">Not a member? Join now</button>
            <button onClick={handleRegisterModal} className="btn">Already a member? Login now</button>
          </div>
        )}
      </div>
      <div className="header__images">
        <img src={banner} alt="banner" />
      </div>
    </div>
  );
}
