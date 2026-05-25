import { usePages } from "./useProducts";

const Pagination = () => {
  const { current, count, set } = usePages();

  return (
    <div>
      <h1>Pagination</h1>
      <button onClick={() => set(current - 1)}>Previous</button>
      <span>
        Page {current} of {Math.ceil(count / 10)}
      </span>
      <button onClick={() => set(current + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
