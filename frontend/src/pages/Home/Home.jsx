import useAuthStore from "../../stores/authStore";
import useLoginModalStore from "../../stores/loginModalStore";
import useRegisterModalStore from "../../stores/registerModalStore";

export default function Home() {
  const { user } = useAuthStore();
  const handleLoginModal = useLoginModalStore(
    (state) => state.handleLoginModal
  );

  const handleRegisterModal = useRegisterModalStore(
    (state) => state.handleRegisterModal
  );
  return (
    <>
      <section className="home" id="home">
        <div className="home-banner">
          <h2 className="text-xl md:text-4xl">Welcome To</h2>
          <h1 className="text-3xl md:text-6xl font-bold">Gladex Loyalty Membership</h1>
          <h3 className="text-lg md:text-2xl">Travel beyond limits with Gladex Membership!</h3>
          {!user && (
            <div className="home-btn-wrapper">
              <button onClick={handleRegisterModal} className="home-btn">
                Not a Member ? Join Now
              </button>
              <button onClick={handleLoginModal} className="home-btn">
                Member Login
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
