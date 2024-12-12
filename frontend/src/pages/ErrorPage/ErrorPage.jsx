import { Result } from "antd";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <section>
      <div className="error-container">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="/">
              <button className="button-brand">Back Home</button>
            </Link>
          }
        />
      </div>
    </section>
  );
}
