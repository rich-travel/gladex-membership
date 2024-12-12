import { Link } from "react-router-dom";

export default function Categories() {
  const categories = [
    {
      name: "qweqwe",
      path: "electronics",
      image: "https://images.unsplash.com/photo-1598838449762-d967ae4546a5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "asdasd",
      path: "electronics",
      image: "https://images.unsplash.com/photo-1598838449762-d967ae4546a5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "qweqwe",
      path: "electronics",
      image: "https://images.unsplash.com/photo-1598838449762-d967ae4546a5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "asdasd",
      path: "electronics",
      image: "https://images.unsplash.com/photo-1598838449762-d967ae4546a5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <>
      <div className="product__grid">
        {categories.map((item, index) => (
          <Link
            key={index}
            className="categories__card"
            to={`/category${item.path}`}
          >
            <img src={item.image} alt="icon" />
            <h4>{item.name}</h4>
          </Link>
        ))}
      </div>
    </>
  );
}
